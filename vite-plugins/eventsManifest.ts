import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const IMAGE_RE = /\.(png|jpe?g|webp|svg|gif)$/i;

function generateEventsManifest(rootDir = process.cwd()) {
  const eventsDir = path.join(rootDir, "public/events");
  const manifestPath = path.join(eventsDir, "manifest.json");

  if (!fs.existsSync(eventsDir)) {
    fs.mkdirSync(eventsDir, { recursive: true });
  }

  const files = fs
    .readdirSync(eventsDir)
    .filter((file) => IMAGE_RE.test(file) && file !== "manifest.json")
    .sort((a, b) => a.localeCompare(b, "ru"));

  const manifest = files.map((file) => {
    const id = file.replace(/\.[^.]+$/, "");
    return {
      id,
      src: `/events/${encodeURIComponent(file)}`,
    };
  });

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

export function eventsManifestPlugin(): Plugin {
  const rootDir = process.cwd();
  const eventsDir = path.join(rootDir, "public/events");

  const run = () => {
    try {
      generateEventsManifest(rootDir);
    } catch {
      // Windows: не роняем dev-сервер при блокировке manifest.json
    }
  };

  return {
    name: "events-manifest",
    buildStart: run,
    configureServer() {
      run();
      if (!fs.existsSync(eventsDir)) return;

      let timer: ReturnType<typeof setTimeout> | undefined;
      fs.watch(eventsDir, () => {
        clearTimeout(timer);
        timer = setTimeout(run, 200);
      });
    },
  };
}
