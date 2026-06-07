import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";

const norm = (value: string) => value.trim().toLowerCase();

function teamsMatch(bet: Bet, match: Match): boolean {
  const a1 = norm(bet.organization1);
  const a2 = norm(bet.organization2);
  const b1 = norm(match.organization1);
  const b2 = norm(match.organization2);
  return (a1 === b1 && a2 === b2) || (a1 === b2 && a2 === b1);
}

/** Связь по дате, формату, ивенту и парам команд — время может отличаться */
export function isBetForMatch(bet: Bet, match: Match): boolean {
  return (
    bet.date === match.date &&
    bet.format === match.format &&
    norm(bet.eventOrganization) === norm(match.eventOrganization) &&
    norm(bet.eventName) === norm(match.eventName) &&
    bet.majorStage === match.majorStage &&
    teamsMatch(bet, match)
  );
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
