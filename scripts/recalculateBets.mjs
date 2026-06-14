import { createDatabase } from "../server/db/sqliteStore.mjs";
import { recalculateMatchBetsInDb } from "../server/bets/recalculateMatchBets.mjs";

const dbPath = process.argv[2] ?? "freedom.db";
const db = createDatabase(dbPath);
await db.read();

const result = await recalculateMatchBetsInDb(db);
console.log(JSON.stringify(result, null, 2));
db.close();
