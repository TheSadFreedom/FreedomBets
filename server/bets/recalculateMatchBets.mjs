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



function resolveBalanceTotals(profile) {

  const legacyDeposits =

    profile.balanceBase != null && Number.isFinite(profile.balanceBase)

      ? roundMoney(Math.max(0, profile.balanceBase))

      : 0;



  const totalDeposited =

    profile.totalDeposited != null && Number.isFinite(profile.totalDeposited)

      ? roundMoney(profile.totalDeposited)

      : legacyDeposits;



  const totalWithdrawn =

    profile.totalWithdrawn != null && Number.isFinite(profile.totalWithdrawn)

      ? roundMoney(profile.totalWithdrawn)

      : 0;



  return { totalDeposited, totalWithdrawn };

}



function enrichProfileWithBets(profile, bets) {

  const profileBets = betsForProfile(bets, profile.id);

  const { totalDeposited, totalWithdrawn } = resolveBalanceTotals(profile);

  const netDeposits = roundMoney(totalDeposited - totalWithdrawn);



  return {

    ...profile,

    balanceBase: 0,

    totalDeposited,

    totalWithdrawn,

    balance: roundMoney(netDeposits + sumBetBalanceDelta(profileBets)),

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



  const betIndex = new Map(bets.map((bet, index) => [bet.id, index]));

  for (const { bet, nextStatus } of plan) {

    const index = betIndex.get(bet.id);

    if (index == null) continue;

    bets[index] = { ...bets[index], status: nextStatus };

  }



  const nextProfiles = profiles.map((profile) => enrichProfileWithBets(profile, bets));

  const profilesChanged = nextProfiles.some((profile, index) => {

    const prev = profiles[index];

    return (

      prev.balance !== profile.balance ||

      prev.totalBets !== profile.totalBets ||

      prev.winRate !== profile.winRate ||

      prev.balanceBase !== profile.balanceBase ||

      prev.totalDeposited !== profile.totalDeposited ||

      prev.totalWithdrawn !== profile.totalWithdrawn

    );

  });



  if (plan.length === 0 && !profilesChanged) {

    return { updated: 0, profilesSynced: 0 };

  }



  db.data.bets = bets;

  db.data.profiles = nextProfiles;

  await db.write();



  return {

    updated: plan.length,

    profilesSynced: nextProfiles.length,

    profilesChanged,

    changes: plan.map(({ bet, nextStatus }) => ({

      betId: bet.id,

      matchId: bet.matchId,

      from: bet.status,

      to: nextStatus,

      teams: `${bet.organization1} vs ${bet.organization2}`,

    })),

  };

}


