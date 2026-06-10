import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IMAGE_RE = /\.(png|jpe?g|webp|svg|gif)$/i;

export function generateEventsManifest(rootDir = process.cwd()) {
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

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  generateEventsManifest();
}
