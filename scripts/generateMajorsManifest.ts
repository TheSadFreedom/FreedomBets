import fs from "node:fs";
import path from "node:path";

const IMAGE_RE = /\.(png|jpe?g|webp|svg|gif)$/i;

export function generateMajorsManifest(rootDir = process.cwd()): void {
  const majorsDir = path.join(rootDir, "public/majors");
  const manifestPath = path.join(majorsDir, "manifest.json");

  if (!fs.existsSync(majorsDir)) {
    fs.mkdirSync(majorsDir, { recursive: true });
  }

  const files = fs
    .readdirSync(majorsDir)
    .filter((file) => IMAGE_RE.test(file) && file !== "manifest.json")
    .sort((a, b) => a.localeCompare(b, "ru"));

  const manifest = files.map((file) => {
    const id = file.replace(/\.[^.]+$/, "");
    return {
      id,
      src: `/majors/${encodeURIComponent(file)}`,
    };
  });

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
