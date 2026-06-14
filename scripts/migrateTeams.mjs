import { resolve } from "node:path";
import { createDatabase } from "../server/db/sqliteStore.mjs";
import { dedupeTeamsInDb } from "../server/teams/dedupeTeamsInDb.mjs";
import { reloadTeamSynonyms } from "../server/sportsru/teamNames.mjs";
import { migrateTeamFieldsInDb } from "../server/teams/teamsStore.mjs";
import { seedDefaultTeamsInDb } from "../server/teams/seedTeamsInDb.mjs";

const dbPath = resolve(process.argv[2] ?? "freedom.db");
const db = createDatabase(dbPath);
await db.read();

if (!Array.isArray(db.data.teams)) {
  db.data.teams = [];
}

seedDefaultTeamsInDb(db);
reloadTeamSynonyms(db.data.teams);
dedupeTeamsInDb(db);

const result = migrateTeamFieldsInDb(db);
await db.write();
db.close();

console.log(`Updated ${dbPath}`);
console.log(`Teams: ${result.teamsCount}`);
console.log(`Matches with team ids: ${result.matchesUpdated}`);
console.log(`Bets with team ids: ${result.betsUpdated}`);
