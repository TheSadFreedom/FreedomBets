import { copyFile, cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { app } from "electron";
import { LEGACY_USER_DATA_FOLDER } from "./constants.mjs";

async function migrateLegacyUserData(userData, dbPath) {
  if (existsSync(dbPath)) return;

  const legacyUserData = path.join(app.getPath("appData"), LEGACY_USER_DATA_FOLDER);
  const legacyDbPath = path.join(legacyUserData, "freedom.db");
  const legacyJsonPath = path.join(legacyUserData, "db.json");
  if (!existsSync(legacyDbPath) && !existsSync(legacyJsonPath)) return;

  console.log(`Migrating user data from ${legacyUserData} to ${userData}`);

  await mkdir(userData, { recursive: true });
  await cp(legacyUserData, userData, { recursive: true, force: false });
}

async function loadSqliteStore(bundledRoot) {
  const storePath = path.join(bundledRoot, "server", "db", "sqliteStore.mjs");
  return import(pathToFileURL(storePath).href);
}

async function ensureDatabase({ bundledRoot, dbPath, legacyJsonPath, bundledSeedDbPath }) {
  if (existsSync(dbPath)) return;

  if (existsSync(legacyJsonPath)) {
    const { ensureSqliteDatabase } = await loadSqliteStore(bundledRoot);
    ensureSqliteDatabase(dbPath, { jsonPath: legacyJsonPath });
    console.log(`Migrated legacy db.json to ${dbPath}`);
    return;
  }

  if (bundledSeedDbPath && existsSync(bundledSeedDbPath)) {
    await copyFile(bundledSeedDbPath, dbPath);
    console.log(`Installed seed database from ${bundledSeedDbPath}`);
    return;
  }

  console.warn(`Bundled seed database not found at ${bundledSeedDbPath ?? "(unknown)"}`);

  const { ensureSqliteDatabase } = await loadSqliteStore(bundledRoot);
  ensureSqliteDatabase(dbPath);
  console.log(`Created empty database at ${dbPath}`);
}

export async function ensureUserData({
  bundledRoot,
  userData,
  dbPath,
  legacyJsonPath,
  bundledSeedDbPath,
  userPublicDir,
}) {
  await mkdir(userData, { recursive: true });
  await migrateLegacyUserData(userData, dbPath);
  await ensureDatabase({ bundledRoot, dbPath, legacyJsonPath, bundledSeedDbPath });
  await mkdir(path.join(userPublicDir, "uploads", "pickems"), { recursive: true });

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
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const from = path.join(sourceDir, entry.name);
    const to = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await copyPublicDir(from, to);
      continue;
    }
    if (!existsSync(to)) {
      await copyFile(from, to);
    }
  }
}
