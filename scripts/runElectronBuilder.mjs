import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(os.homedir(), "AppData", "Local", "FreedomBets-release");

function cleanOutputDir() {
  for (const name of ["win-unpacked", "win-unpacked.tmp"]) {
    const target = path.join(outputDir, name);
    if (!existsSync(target)) continue;
    rmSync(target, { recursive: true, force: true });
  }
}

function runElectronBuilder(extraArgs) {
  const args = [
    "electron-builder",
    "--win",
    `--config.directories.output=${outputDir}`,
    ...extraArgs,
  ];

  const result = spawnSync("npx", args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  return result.status ?? 1;
}

function hasBuiltInstaller() {
  if (!existsSync(outputDir)) return false;
  return readdirSync(outputDir).some(
    (name) => name.endsWith(".exe") && name.includes("Setup")
  );
}

function assertPublishArtifacts() {
  if (!existsSync(outputDir)) {
    throw new Error(`Папка сборки не найдена: ${outputDir}`);
  }

  const names = readdirSync(outputDir);
  const hasLatest = names.includes("latest.yml");
  const installer = names.find((name) => name.endsWith(".exe") && name.includes("Setup"));

  if (!hasLatest || !installer) {
    throw new Error(
      [
        "Нельзя публиковать релиз: не хватает артефактов electron-builder.",
        `latest.yml: ${hasLatest ? "ok" : "нет"}`,
        `installer: ${installer ?? "нет"}`,
        `Папка: ${outputDir}`,
      ].join("\n")
    );
  }

  console.log(`Publish artifacts: ${installer}, latest.yml`);
}

function printPublishHelp() {
  console.error("\nПубликация на GitHub не выполнена: не задан GH_TOKEN.");
  console.error("Создайте токен с правом repo и запустите:");
  console.error('  $env:GH_TOKEN="ghp_..."; npm run desktop:publish');
  console.error("\nДля локальной сборки без публикации:");
  console.error("  npm run desktop:dist");
}

function mirrorArtifactsToProjectRelease() {
  if (!existsSync(outputDir)) return;

  const projectRelease = path.join(projectRoot, "release");
  mkdirSync(projectRelease, { recursive: true });

  for (const name of readdirSync(outputDir)) {
    const isInstaller = name.endsWith(".exe") && name.includes("Setup");
    const isBlockMap = name.endsWith(".exe.blockmap");
    const isLatest = name === "latest.yml";

    if (!isInstaller && !isBlockMap && !isLatest) continue;

    cpSync(path.join(outputDir, name), path.join(projectRelease, name), { force: true });
  }
}

cleanOutputDir();

const extraArgs = process.argv.slice(2);
const publishing = extraArgs.some((arg) => arg.startsWith("--publish"));
const exitCode = runElectronBuilder(extraArgs);

if (exitCode === 0 && publishing) {
  try {
    assertPublishArtifacts();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

try {
  mirrorArtifactsToProjectRelease();
} catch (error) {
  console.warn("Could not copy artifacts to ./release (non-fatal):", error);
}

console.log(`\nBuild output: ${outputDir}`);

if (exitCode !== 0) {
  const publishing = extraArgs.some((arg) => arg.startsWith("--publish"));
  if (publishing && !process.env.GH_TOKEN && hasBuiltInstaller()) {
    printPublishHelp();
    console.error(`\nУстановщик уже собран: ${outputDir}`);
  }
  process.exit(exitCode);
}
