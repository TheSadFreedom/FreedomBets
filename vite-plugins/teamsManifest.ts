import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const IMAGE_RE = /\.(png|jpe?g|webp|svg|gif)$/i;

function generateTeamsManifest(rootDir = process.cwd()) {
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

export function teamsManifestPlugin(): Plugin {
  const rootDir = process.cwd();
  const teamsDir = path.join(rootDir, "public/teams");

  const run = () => {
    try {
      generateTeamsManifest(rootDir);
    } catch {
      // Windows: не роняем dev-сервер при блокировке manifest.json
    }
  };

  return {
    name: "teams-manifest",
    buildStart: run,
    configureServer() {
      run();
      if (!fs.existsSync(teamsDir)) return;

      let timer: ReturnType<typeof setTimeout> | undefined;
      fs.watch(teamsDir, () => {
        clearTimeout(timer);
        timer = setTimeout(run, 200);
      });
    },
  };
}
