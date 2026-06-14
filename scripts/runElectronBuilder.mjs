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
    (name) => name.startsWith("FreedomBets Setup") && name.endsWith(".exe")
  );
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
    const isInstaller = name.startsWith("FreedomBets Setup") && name.endsWith(".exe");
    const isBlockMap = name.endsWith(".exe.blockmap");
    const isLatest = name === "latest.yml";

    if (!isInstaller && !isBlockMap && !isLatest) continue;

    cpSync(path.join(outputDir, name), path.join(projectRelease, name), { force: true });
  }
}

cleanOutputDir();

const extraArgs = process.argv.slice(2);
const exitCode = runElectronBuilder(extraArgs);

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
