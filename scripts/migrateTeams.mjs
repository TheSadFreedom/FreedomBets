import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { migrateTeamFieldsInDb } from "../server/teams/teamsStore.mjs";
import { reloadTeamSynonyms } from "../server/sportsru/teamNames.mjs";

const dbPath = resolve(process.argv[2] ?? "db.json");
const db = { data: JSON.parse(readFileSync(dbPath, "utf-8")) };

reloadTeamSynonyms();

if (!Array.isArray(db.data.teams)) {
  db.data.teams = [];
}

const result = migrateTeamFieldsInDb(db);

writeFileSync(dbPath, `${JSON.stringify(db.data, null, 2)}\n`, "utf-8");

console.log(`Updated ${dbPath}`);
console.log(`Teams: ${result.teamsCount}`);
console.log(`Matches with team ids: ${result.matchesUpdated}`);
console.log(`Bets with team ids: ${result.betsUpdated}`);
