import { readFileSync, writeFileSync } from "node:fs";

const DB_PATH = "db.json";
const PROFILE_ID = 1;
const INITIAL_BALANCE = 10000;
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

const db = JSON.parse(readFileSync(DB_PATH, "utf8"));
const profile = db.profiles.find((item) => String(item.id) === String(PROFILE_ID));

if (!profile) {
  console.error(`Profile ${PROFILE_ID} not found`);
  process.exit(1);
}

const bets = db.bets.filter((bet) => bet.profileId === PROFILE_ID);
const sumDelta = roundMoney(bets.reduce((sum, bet) => sum + betBalanceDelta(bet), 0));
const nextBalance = clampBalance(INITIAL_BALANCE + sumDelta);

const before = {
  balance: profile.balance,
  balanceBase: profile.balanceBase,
  totalBets: profile.totalBets,
  winRate: profile.winRate,
};

profile.balanceBase = INITIAL_BALANCE;
profile.balance = nextBalance;
profile.totalBets = bets.length;
profile.winRate = calcWinRate(bets);

writeFileSync(DB_PATH, `${JSON.stringify(db, null, 2)}\n`);

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
        totalBets: profile.totalBets,
        winRate: profile.winRate,
      },
    },
    null,
    2
  )
);
