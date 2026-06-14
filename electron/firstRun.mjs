import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export async function ensureUserData({ bundledRoot, userData, dbPath, bundledDbPath, userPublicDir }) {
  await mkdir(userData, { recursive: true });
  await mkdir(path.join(userPublicDir, "uploads", "pickems"), { recursive: true });

  if (!existsSync(dbPath) && existsSync(bundledDbPath)) {
    await copyFile(bundledDbPath, dbPath);
  }

  const bundledPublic = path.join(bundledRoot, "public");
  if (!existsSync(bundledPublic)) return;

  await copyPublicDir(path.join(bundledPublic, "events"), path.join(userPublicDir, "events"));
  await copyPublicDir(path.join(bundledPublic, "teams"), path.join(userPublicDir, "teams"));

  const logoSrc = path.join(bundledPublic, "logo.png");
  const logoDst = path.join(userPublicDir, "logo.png");
  if (existsSync(logoSrc) && !existsSync(logoDst)) {
    await copyFile(logoSrc, logoDst);
  }
}

async function copyPublicDir(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) return;

  await mkdir(targetDir, { recursive: true });
  const { readdir, copyFile: copy } = await import("node:fs/promises");
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const from = path.join(sourceDir, entry.name);
    const to = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await copyPublicDir(from, to);
      continue;
    }
    if (!existsSync(to)) {
      await copy(from, to);
    }
  }
}
