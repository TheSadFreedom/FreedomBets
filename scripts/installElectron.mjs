import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { downloadArtifact } = require("@electron/get");

const electronRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "node_modules", "electron");

if (!fs.existsSync(path.join(electronRoot, "package.json"))) {
  console.log("electron is not installed, skipping binary download");
  process.exit(0);
}

const { version } = require(path.join(electronRoot, "package.json"));
const platformPath = process.platform === "win32" ? "electron.exe" : "electron";
const distPath = path.join(electronRoot, "dist");
const executablePath = path.join(distPath, platformPath);

function isInstalled() {
  try {
    const installedVersion = fs
      .readFileSync(path.join(distPath, "version"), "utf-8")
      .replace(/^v/, "");
    const pathValue = fs.readFileSync(path.join(electronRoot, "path.txt"), "utf-8");
    return installedVersion === version && pathValue === platformPath && fs.existsSync(executablePath);
  } catch {
    return false;
  }
}

function extractZip(zipPath, targetDir) {
  if (process.platform === "win32") {
    const result = spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${targetDir.replace(/'/g, "''")}' -Force`,
      ],
      { stdio: "inherit" },
    );
    if (result.status !== 0) {
      throw new Error(`Expand-Archive failed with code ${result.status ?? "unknown"}`);
    }
    return;
  }

  const result = spawnSync("unzip", ["-oq", zipPath, "-d", targetDir], { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`unzip failed with code ${result.status ?? "unknown"}`);
  }
}

async function main() {
  if (isInstalled()) {
    console.log(`Electron ${version} already installed`);
    return;
  }

  console.log(`Installing Electron ${version} for ${process.platform}-${process.arch}...`);

  const zipPath = await downloadArtifact({
    version,
    artifactName: "electron",
    platform: process.platform,
    arch: process.arch,
    force: true,
    checksums: require(path.join(electronRoot, "checksums.json")),
  });

  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });
  extractZip(zipPath, distPath);

  const srcTypeDefPath = path.join(distPath, "electron.d.ts");
  const targetTypeDefPath = path.join(electronRoot, "electron.d.ts");
  if (fs.existsSync(srcTypeDefPath)) {
    fs.renameSync(srcTypeDefPath, targetTypeDefPath);
  }

  fs.writeFileSync(path.join(electronRoot, "path.txt"), platformPath);
  fs.writeFileSync(path.join(distPath, "version"), `v${version}`);

  if (!fs.existsSync(executablePath)) {
    throw new Error(`Electron executable not found at ${executablePath}`);
  }

  console.log(`Electron ready: ${executablePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
