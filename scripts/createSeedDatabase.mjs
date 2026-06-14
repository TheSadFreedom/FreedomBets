import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabase, openDatabase, saveDataToSqlite } from "../server/db/sqliteStore.mjs";
import { EMPTY_DATA } from "../server/db/schema.mjs";
import { dedupeTeamsInDb } from "../server/teams/dedupeTeamsInDb.mjs";
import { seedDefaultTeamsInDb } from "../server/teams/seedTeamsInDb.mjs";
import { reloadTeamSynonyms } from "../server/sportsru/teamNames.mjs";
import { migrateTeamFieldsInDb } from "../server/teams/teamsStore.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDbPath = join(projectRoot, "freedom.db");
const seedPath = join(projectRoot, "data", "seed-freedom.db");

mkdirSync(dirname(seedPath), { recursive: true });

if (existsSync(seedPath)) {
  rmSync(seedPath, { force: true });
}

if (existsSync(sourceDbPath)) {
  copyFileSync(sourceDbPath, seedPath);
  console.log(`Seed copied from ${sourceDbPath}`);
} else {
  const sqlite = openDatabase(seedPath);
  saveDataToSqlite(sqlite, EMPTY_DATA);
  sqlite.close();
  console.log(`Seed created empty (no freedom.db found)`);
}

const db = createDatabase(seedPath);
await db.read();

if (!Array.isArray(db.data.teams)) {
  db.data.teams = [];
}

seedDefaultTeamsInDb(db);
reloadTeamSynonyms(db.data.teams);
dedupeTeamsInDb(db);
const migrated = migrateTeamFieldsInDb(db);
await db.write();
db.close();

console.log(`Seed database ready: ${seedPath}`);
console.log(
  `profiles=${db.data.profiles?.length ?? 0}, teams=${migrated.teamsCount}, matches=${db.data.matches?.length ?? 0}, bets=${db.data.bets?.length ?? 0}`
);
