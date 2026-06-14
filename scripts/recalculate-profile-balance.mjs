import { resolve } from "node:path";
import { createDatabase } from "../server/db/sqliteStore.mjs";

const dbPath = resolve(process.argv[2] ?? "freedom.db");
const PROFILE_ID = 1;
const INITIAL_DEPOSITS = 10000;
const MAX_BALANCE = 1_000_000;

function roundMoney(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

function clampBalance(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(0, roundMoney(value)), MAX_BALANCE);
}

function betBalanceDelta(bet) {
  if (bet.status === "WAIT") return -bet.amount;
  if (bet.status === "WIN") return bet.amount * bet.odds - bet.amount;
  return -bet.amount;
}

function calcWinRate(bets) {
  const settled = bets.filter((b) => b.status === "WIN" || b.status === "LOSE");
  if (settled.length === 0) return 0;
  const wins = settled.filter((b) => b.status === "WIN").length;
  return Math.round((wins / settled.length) * 100);
}

const db = createDatabase(dbPath);
await db.read();

const profile = db.data.profiles.find((item) => String(item.id) === String(PROFILE_ID));
if (!profile) {
  console.error(`Profile ${PROFILE_ID} not found`);
  process.exit(1);
}

const bets = db.data.bets.filter((bet) => bet.profileId === PROFILE_ID);
const sumDelta = roundMoney(bets.reduce((sum, bet) => sum + betBalanceDelta(bet), 0));
const totalWithdrawn =
  profile.totalWithdrawn != null && Number.isFinite(profile.totalWithdrawn)
    ? roundMoney(profile.totalWithdrawn)
    : 0;
const netDeposits = roundMoney(INITIAL_DEPOSITS - totalWithdrawn);
const nextBalance = clampBalance(netDeposits + sumDelta);

const before = {
  balance: profile.balance,
  balanceBase: profile.balanceBase,
  totalDeposited: profile.totalDeposited,
  totalWithdrawn: profile.totalWithdrawn,
  totalBets: profile.totalBets,
  winRate: profile.winRate,
};

profile.balanceBase = 0;
profile.totalDeposited = INITIAL_DEPOSITS;
profile.totalWithdrawn = totalWithdrawn;
profile.balance = nextBalance;
profile.totalBets = bets.length;
profile.winRate = calcWinRate(bets);

await db.write();
db.close();

console.log(
  JSON.stringify(
    {
      profileId: PROFILE_ID,
      betsCount: bets.length,
      sumBetDeltas: sumDelta,
      before,
      after: {
        balance: profile.balance,
        balanceBase: profile.balanceBase,
        totalDeposited: profile.totalDeposited,
        totalWithdrawn: profile.totalWithdrawn,
        totalBets: profile.totalBets,
        winRate: profile.winRate,
      },
    },
    null,
    2,
  ),
);
