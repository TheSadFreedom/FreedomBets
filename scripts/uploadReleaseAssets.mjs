import { createReadStream, existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(os.homedir(), "AppData", "Local", "FreedomBets-release");
const owner = "TheSadFreedom";
const repo = "FreedomBets";

function readVersion() {
  const packageJson = JSON.parse(
    readFileSync(path.join(projectRoot, "package.json"), "utf8")
  );
  return String(packageJson.version ?? "").trim();
}

function readInstallerName() {
  const latestPath = path.join(outputDir, "latest.yml");
  if (!existsSync(latestPath)) {
    throw new Error(`Не найден ${latestPath}. Сначала выполните npm run desktop:dist`);
  }

  const latest = readFileSync(latestPath, "utf8");
  const match = /^path:\s*(.+)$/m.exec(latest);
  if (!match?.[1]) {
    throw new Error("В latest.yml не найден path к установщику");
  }

  return match[1].trim();
}

async function githubRequest(url, options = {}) {
  const token = process.env.GH_TOKEN;
  if (!token) {
    throw new Error("Не задан GH_TOKEN. В PowerShell: $env:GH_TOKEN = \"ghp_...\"");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

async function uploadAsset(releaseId, filePath, assetName) {
  const { size } = await import("node:fs/promises").then((fs) => fs.stat(filePath));
  const url = `https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?name=${encodeURIComponent(assetName)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/octet-stream",
      "Content-Length": String(size),
    },
    duplex: "half",
    body: createReadStream(filePath),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Upload ${assetName} failed ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

async function main() {
  const version = readVersion();
  const tag = `v${version}`;
  const installerName = readInstallerName();
  const installerPath = path.join(outputDir, installerName);
  const latestPath = path.join(outputDir, "latest.yml");
  const blockmapPath = `${installerPath}.blockmap`;

  if (!existsSync(installerPath)) {
    throw new Error(`Не найден установщик: ${installerPath}`);
  }

  const release = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`
  );

  const existing = new Set((release.assets ?? []).map((asset) => asset.name));
  const required = [
    { name: "latest.yml", path: latestPath },
    { name: installerName, path: installerPath },
    { name: `${installerName}.blockmap`, path: blockmapPath },
  ];

  console.log(`Release ${tag} (#${release.id})`);
  console.log(`Existing assets: ${[...existing].join(", ") || "(none)"}`);

  for (const asset of required) {
    if (!existsSync(asset.path)) {
      console.warn(`Skip missing file: ${asset.path}`);
      continue;
    }
    if (existing.has(asset.name)) {
      console.log(`Already uploaded: ${asset.name}`);
      continue;
    }

    console.log(`Uploading ${asset.name}...`);
    await uploadAsset(release.id, asset.path, asset.name);
    console.log(`Uploaded: ${asset.name}`);
  }

  console.log("\nГотово. Проверьте:");
  console.log(`https://github.com/${owner}/${repo}/releases/tag/${tag}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
