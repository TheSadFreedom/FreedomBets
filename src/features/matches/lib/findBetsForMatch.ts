import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";

const norm = (value: string) => value.trim().toLowerCase();

function stagesEqual(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  return (a ?? null) === (b ?? null);
}

function teamsMatch(bet: Bet, match: Match): boolean {
  const a1 = norm(bet.organization1);
  const a2 = norm(bet.organization2);
  const b1 = norm(match.organization1);
  const b2 = norm(match.organization2);
  return (a1 === b1 && a2 === b2) || (a1 === b2 && a2 === b1);
}

function eventTeamsFormatMatch(bet: Bet, match: Match): boolean {
  return (
    bet.format === match.format &&
    norm(bet.eventOrganization) === norm(match.eventOrganization) &&
    norm(bet.eventName) === norm(match.eventName) &&
    stagesEqual(bet.majorStage, match.majorStage) &&
    teamsMatch(bet, match)
  );
}

/** Сопоставление старых ставок без matchId по турниру, командам, формату и дате/времени. */
export function legacyBetMatchesMatch(bet: Bet, match: Match): boolean {
  if (!eventTeamsFormatMatch(bet, match)) {
    return false;
  }
  if (bet.date === match.date) {
    return true;
  }
  return bet.time === match.time;
}

function pickUniqueMatch(candidates: Match[], bet: Bet): Match | null {
  if (candidates.length === 1) {
    return candidates[0];
  }
  const byDate = candidates.filter((match) => match.date === bet.date);
  if (byDate.length === 1) {
    return byDate[0];
  }
  const byTime = candidates.filter((match) => match.time === bet.time);
  if (byTime.length === 1) {
    return byTime[0];
  }
  return null;
}

/** Найти матч для ставки; для старых записей — по полям, без matchId. */
export function findMatchForBet(bet: Bet, matches: Match[]): Match | null {
  const linkedMatchId = bet.matchId?.trim();
  if (linkedMatchId) {
    return matches.find((match) => match.id === linkedMatchId) ?? null;
  }
  return pickUniqueMatch(matches.filter((match) => legacyBetMatchesMatch(bet, match)), bet);
}

/** Связь по matchId или по турниру, командам и формату (дата и/или время). */
export function isBetForMatch(bet: Bet, match: Match): boolean {
  const linkedMatchId = bet.matchId?.trim();
  if (linkedMatchId) {
    return linkedMatchId === match.id;
  }
  return legacyBetMatchesMatch(bet, match);
}

export function findBetsForMatch(match: Match, bets: Bet[]): Bet[] {
  return bets
    .filter((bet) => isBetForMatch(bet, match))
    .sort((a, b) => {
      const statusOrder = { WAIT: 0, WIN: 1, LOSE: 2 };
      const statusCmp = statusOrder[a.status] - statusOrder[b.status];
      if (statusCmp !== 0) return statusCmp;
      return b.amount - a.amount;
    });
}
