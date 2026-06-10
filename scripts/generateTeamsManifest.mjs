import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IMAGE_RE = /\.(png|jpe?g|webp|svg|gif)$/i;

export function generateTeamsManifest(rootDir = process.cwd()) {
  const teamsDir = path.join(rootDir, "public/teams");
  const manifestPath = path.join(teamsDir, "manifest.json");

  if (!fs.existsSync(teamsDir)) {
    fs.mkdirSync(teamsDir, { recursive: true });
  }

  const files = fs
    .readdirSync(teamsDir)
    .filter((file) => IMAGE_RE.test(file) && file !== "manifest.json")
    .sort((a, b) => a.localeCompare(b, "ru"));

  const manifest = files.map((file) => {
    const id = file.replace(/\.[^.]+$/, "");
    return {
      id,
      src: `/teams/${encodeURIComponent(file)}`,
    };
  });

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  generateTeamsManifest();
}
