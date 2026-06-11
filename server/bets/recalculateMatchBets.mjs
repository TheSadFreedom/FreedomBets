import { planMatchBetRecalculations } from "./settlement.mjs";

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function betBalanceDelta(bet) {
  const status = bet.status;
  if (status === "WAIT") return -bet.amount;
  if (status === "WIN") return bet.amount * bet.odds - bet.amount;
  return -bet.amount;
}

function sumBetBalanceDelta(bets) {
  return roundMoney(bets.reduce((sum, bet) => sum + betBalanceDelta(bet), 0));
}

function betsForProfile(bets, profileId) {
  return bets.filter((bet) => Number(bet.profileId) === Number(profileId));
}

function enrichProfileWithBets(profile, bets) {
  const profileBets = betsForProfile(bets, profile.id);
  const balanceBase =
    profile.balanceBase != null && Number.isFinite(profile.balanceBase)
      ? roundMoney(profile.balanceBase)
      : roundMoney(profile.balance - sumBetBalanceDelta(profileBets));

  return {
    ...profile,
    balanceBase,
    balance: roundMoney(balanceBase + sumBetBalanceDelta(profileBets)),
    totalBets: profileBets.length,
    winRate: (() => {
      const settled = profileBets.filter((b) => b.status === "WIN" || b.status === "LOSE");
      if (settled.length === 0) return 0;
      const wins = settled.filter((b) => b.status === "WIN").length;
      return Math.round((wins / settled.length) * 100);
    })(),
  };
}

/**
 * Пересчитывает статусы ставок по актуальному счёту матчей и обновляет профили.
 * @param {import('lowdb').Low} db
 * @param {import('../entities').Match[]} [matches] — если не передано, все матчи из базы
 */
export async function recalculateMatchBetsInDb(db, matches = null) {
  await db.read();
  const allMatches = matches ?? (Array.isArray(db.data.matches) ? db.data.matches : []);
  const bets = Array.isArray(db.data.bets) ? [...db.data.bets] : [];
  const profiles = Array.isArray(db.data.profiles) ? [...db.data.profiles] : [];

  const plan = allMatches.flatMap((match) => planMatchBetRecalculations(match, bets));
  if (plan.length === 0) {
    return { updated: 0, profilesSynced: 0 };
  }

  const betIndex = new Map(bets.map((bet, index) => [bet.id, index]));
  for (const { bet, nextStatus } of plan) {
    const index = betIndex.get(bet.id);
    if (index == null) continue;
    bets[index] = { ...bets[index], status: nextStatus };
  }

  const affectedProfileIds = new Set(plan.map(({ bet }) => Number(bet.profileId)));
  const nextProfiles = profiles.map((profile) => {
    if (!affectedProfileIds.has(Number(profile.id))) return profile;
    return enrichProfileWithBets(profile, bets);
  });

  db.data.bets = bets;
  db.data.profiles = nextProfiles;
  await db.write();

  return {
    updated: plan.length,
    profilesSynced: affectedProfileIds.size,
    changes: plan.map(({ bet, nextStatus }) => ({
      betId: bet.id,
      matchId: bet.matchId,
      from: bet.status,
      to: nextStatus,
      teams: `${bet.organization1} vs ${bet.organization2}`,
    })),
  };
}
