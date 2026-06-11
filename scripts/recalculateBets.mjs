import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { recalculateMatchBetsInDb } from "../server/bets/recalculateMatchBets.mjs";

const adapter = new JSONFile(process.argv[2] ?? "db.json");
const db = new Low(adapter, {});
await db.read();

if (!db.data) {
  throw new Error("Database is empty");
}

const result = await recalculateMatchBetsInDb(db);
console.log(JSON.stringify(result, null, 2));
