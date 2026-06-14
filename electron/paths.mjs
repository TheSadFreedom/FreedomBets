import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "electron";

const electronDir = path.dirname(fileURLToPath(import.meta.url));

export function getAppPaths() {
  const isPackaged = app.isPackaged;
  const projectRoot = isPackaged ? process.resourcesPath : path.join(electronDir, "..");

  const userData = app.getPath("userData");

  return {
    isPackaged,
    isDev: !isPackaged,
    bundledRoot: projectRoot,
    userData,
    dbPath: path.join(userData, "freedom.db"),
    legacyJsonPath: path.join(userData, "db.json"),
    bundledSeedDbPath: resolveBundledSeedPath(projectRoot),
    userPublicDir: path.join(userData, "public"),
    serverEntry: path.join(projectRoot, "server", "index.mjs"),
    distDir: path.join(isPackaged ? app.getAppPath() : projectRoot, "dist"),
  };
}

function resolveBundledSeedPath(projectRoot) {
  const candidates = [
    path.join(projectRoot, "seed-freedom.db"),
    path.join(projectRoot, "data", "seed-freedom.db"),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}
