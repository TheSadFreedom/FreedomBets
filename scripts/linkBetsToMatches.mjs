import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const dbPath = resolve(process.argv[2] ?? "db.json");
const db = JSON.parse(readFileSync(dbPath, "utf-8"));

const norm = (value) => value.trim().toLowerCase();

const stagesEqual = (a, b) => (a ?? null) === (b ?? null);

const teamsMatch = (bet, match) => {
  const a1 = norm(bet.organization1);
  const a2 = norm(bet.organization2);
  const b1 = norm(match.organization1);
  const b2 = norm(match.organization2);
  return (a1 === b1 && a2 === b2) || (a1 === b2 && a2 === b1);
};

const eventTeamsFormatMatch = (bet, match) =>
  bet.format === match.format &&
  norm(bet.eventOrganization) === norm(match.eventOrganization) &&
  norm(bet.eventName) === norm(match.eventName) &&
  stagesEqual(bet.majorStage, match.majorStage) &&
  teamsMatch(bet, match);

const legacyBetMatchesMatch = (bet, match) => {
  if (!eventTeamsFormatMatch(bet, match)) return false;
  if (bet.date === match.date) return true;
  return bet.time === match.time;
};

const pickUniqueMatch = (candidates, bet) => {
  if (candidates.length === 1) return candidates[0];
  const byDate = candidates.filter((match) => match.date === bet.date);
  if (byDate.length === 1) return byDate[0];
  const byTime = candidates.filter((match) => match.time === bet.time);
  if (byTime.length === 1) return byTime[0];
  return null;
};

const findMatchForBet = (bet, matches) => {
  const linkedMatchId = bet.matchId?.trim();
  if (linkedMatchId) {
    return matches.find((match) => match.id === linkedMatchId) ?? null;
  }
  return pickUniqueMatch(matches.filter((match) => legacyBetMatchesMatch(bet, match)), bet);
};

let linked = 0;
let synced = 0;
const unmatched = [];

for (const bet of db.bets) {
  const match = findMatchForBet(bet, db.matches);
  if (!match) {
    unmatched.push(bet.id);
    continue;
  }

  if (bet.matchId?.trim() !== match.id) {
    bet.matchId = match.id;
    linked += 1;
  }

  if (bet.date !== match.date || bet.time !== match.time) {
    bet.date = match.date;
    bet.time = match.time;
    synced += 1;
  }
}

writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`, "utf-8");

console.log(`Updated ${dbPath}`);
console.log(`Linked matchId: ${linked}`);
console.log(`Synced date/time: ${synced}`);
if (unmatched.length > 0) {
  console.log(`Unmatched bets: ${unmatched.join(", ")}`);
  process.exitCode = 1;
}
