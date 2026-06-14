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
    dbPath: path.join(userData, "db.json"),
    bundledDbPath: path.join(projectRoot, "db.json"),
    userPublicDir: path.join(userData, "public"),
    serverEntry: path.join(projectRoot, "server", "index.mjs"),
    distDir: path.join(isPackaged ? app.getAppPath() : projectRoot, "dist"),
  };
}
