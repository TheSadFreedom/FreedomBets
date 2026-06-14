import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { COLLECTIONS, EMPTY_DATA, initSchema } from "./schema.mjs";

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function itemId(item) {
  if (item?.id == null || item.id === "") return null;
  return String(item.id);
}

export function openDatabase(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const sqlite = new DatabaseSync(dbPath);
  sqlite.exec("PRAGMA journal_mode = WAL");
  sqlite.exec("PRAGMA foreign_keys = ON");
  initSchema(sqlite);
  return sqlite;
}

export function loadDataFromSqlite(sqlite) {
  const data = { ...EMPTY_DATA, rankings: { baseline: null } };

  for (const table of COLLECTIONS) {
    const rows = sqlite.prepare(`SELECT payload FROM ${table}`).all();
    data[table] = rows.map((row) => parseJson(row.payload, null)).filter(Boolean);
  }

  const rankingsRow = sqlite
    .prepare(`SELECT payload FROM app_meta WHERE key = 'rankings'`)
    .get();
  if (rankingsRow?.payload) {
    data.rankings = parseJson(rankingsRow.payload, { baseline: null });
  }

  if (!data.rankings || typeof data.rankings !== "object") {
    data.rankings = { baseline: null };
  }
  if (!("baseline" in data.rankings)) {
    data.rankings.baseline = null;
  }

  return data;
}

export function saveDataToSqlite(sqlite, data) {
  sqlite.exec("BEGIN IMMEDIATE");
  try {
    for (const table of COLLECTIONS) {
      sqlite.prepare(`DELETE FROM ${table}`).run();
      const insert = sqlite.prepare(`INSERT INTO ${table} (id, payload) VALUES (?, ?)`);
      for (const item of data[table] ?? []) {
        const id = itemId(item);
        if (!id) continue;
        insert.run(id, JSON.stringify(item));
      }
    }

    sqlite.prepare(`DELETE FROM app_meta WHERE key = 'rankings'`).run();
    sqlite
      .prepare(`INSERT INTO app_meta (key, payload) VALUES ('rankings', ?)`)
      .run(JSON.stringify(data.rankings ?? { baseline: null }));

    sqlite.exec("COMMIT");
  } catch (error) {
    sqlite.exec("ROLLBACK");
    throw error;
  }
}

export function migrateJsonFileToSqlite(jsonPath, dbPath) {
  const raw = readFileSync(jsonPath, "utf-8").trim();
  const parsed = raw ? parseJson(raw, null) : null;
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Invalid JSON database: ${jsonPath}`);
  }

  const data = {
    ...EMPTY_DATA,
    ...parsed,
    rankings:
      parsed.rankings && typeof parsed.rankings === "object"
        ? parsed.rankings
        : { baseline: null },
  };

  for (const table of COLLECTIONS) {
    if (!Array.isArray(data[table])) {
      data[table] = [];
    }
  }

  const sqlite = openDatabase(dbPath);
  saveDataToSqlite(sqlite, data);
  sqlite.close();
  return data;
}

export function ensureSqliteDatabase(dbPath, { jsonPath = null } = {}) {
  if (existsSync(dbPath)) {
    return dbPath;
  }

  const legacyJsonPath =
    jsonPath ?? (dbPath.endsWith(".db") ? dbPath.replace(/\.db$/i, ".json") : null);

  if (legacyJsonPath && existsSync(legacyJsonPath)) {
    migrateJsonFileToSqlite(legacyJsonPath, dbPath);
    return dbPath;
  }

  openDatabase(dbPath).close();
  return dbPath;
}

export class SqliteDatabase {
  constructor(dbPath) {
    this.file = dbPath;
    this.sqlite = openDatabase(dbPath);
    this.data = { ...EMPTY_DATA };
  }

  async read() {
    this.data = loadDataFromSqlite(this.sqlite);
    return this.data;
  }

  async write() {
    saveDataToSqlite(this.sqlite, this.data);
  }

  close() {
    this.sqlite.close();
  }
}

export function createDatabase(dbPath, options = {}) {
  ensureSqliteDatabase(dbPath, options);
  return new SqliteDatabase(dbPath);
}
