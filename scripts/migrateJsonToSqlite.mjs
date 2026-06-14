import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { migrateJsonFileToSqlite } from "../server/db/sqliteStore.mjs";

const { positionals } = parseArgs({
  allowPositionals: true,
});

if (positionals.length === 0) {
  console.error("Usage: node scripts/migrateJsonToSqlite.mjs <source.json> [target.db]");
  process.exit(1);
}

const jsonPath = resolve(positionals[0]);
const dbPath = resolve(positionals[1] ?? join(dirname(jsonPath), "freedom.db"));

const data = migrateJsonFileToSqlite(jsonPath, dbPath);

console.log(
  JSON.stringify(
    {
      jsonPath,
      dbPath,
      profiles: data.profiles.length,
      bets: data.bets.length,
      matches: data.matches.length,
      events: data.events.length,
      pickems: data.pickems.length,
      medals: data.medals.length,
      teams: data.teams.length,
      hasRankingBaseline: Boolean(data.rankings?.baseline),
    },
    null,
    2,
  ),
);
