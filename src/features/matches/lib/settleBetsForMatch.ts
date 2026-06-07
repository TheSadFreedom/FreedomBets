import type { Bet, BetStatus } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { findBetsForMatch } from "@/features/matches/lib/findBetsForMatch";
import { hasMatchScore } from "@/features/matches/lib/matchScore";

/** Победитель серии по счёту карт (score1 : score2). */
export function getMatchSeriesWinner(
  match: Pick<Match, "score1" | "score2">
): 1 | 2 | null {
  if (!hasMatchScore(match)) return null;
  if (match.score1 === match.score2) return null;
  return match.score1! > match.score2! ? 1 : 2;
}

/** Авто-расчёт возможен только для ставок на исход матча (не карта / пистолет). */
export function resolveAutoBetStatus(bet: Bet, winner: 1 | 2): BetStatus | null {
  if (bet.status !== "WAIT") return null;
  if (bet.betMarket !== "match") return null;
  return bet.betTeam === winner ? "WIN" : "LOSE";
}

export interface BetSettlementPlan {
  bet: Bet;
  nextStatus: BetStatus;
}

export function planMatchBetSettlements(match: Match, bets: Bet[]): BetSettlementPlan[] {
  const winner = getMatchSeriesWinner(match);
  if (winner == null) return [];

  return findBetsForMatch(match, bets).flatMap((bet) => {
    const nextStatus = resolveAutoBetStatus(bet, winner);
    return nextStatus ? [{ bet, nextStatus }] : [];
  });
}

/** WAIT-ставки на карту/пистолет — без данных по картам не рассчитываются. */
export function countSkippedWaitBets(match: Match, bets: Bet[]): number {
  const winner = getMatchSeriesWinner(match);
  if (winner == null) return 0;

  return findBetsForMatch(match, bets).filter(
    (bet) => bet.status === "WAIT" && bet.betMarket !== "match"
  ).length;
}

export function countPendingMatchBets(match: Match, bets: Bet[]): number {
  return planMatchBetSettlements(match, bets).length;
}

export interface MatchSettlementResult {
  settled: number;
  skipped: number;
}
