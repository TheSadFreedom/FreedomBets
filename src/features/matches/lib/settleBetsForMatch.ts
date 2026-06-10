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

/** Сыграно карт в серии (сумма счёта). */
export function getMatchMapsPlayed(
  match: Pick<Match, "score1" | "score2">
): number | null {
  if (!hasMatchScore(match)) return null;
  return match.score1! + match.score2!;
}

/** Авто-расчёт ставки «возьмёт хотя бы одну карту». */
export function resolveAtLeastOneMapBetStatus(
  bet: Bet,
  match: Pick<Match, "format" | "score1" | "score2">
): BetStatus | null {
  if (bet.status !== "WAIT" || bet.betMarket !== "atLeastOneMap") return null;
  if (match.format === "BO1" || getMatchSeriesWinner(match) == null) return null;
  if (!hasMatchScore(match)) return null;

  const mapsWon = bet.betTeam === 1 ? match.score1! : match.score2!;
  const tookAtLeastOne = mapsWon >= 1;
  const pickedYes = bet.yesNo === true;
  return tookAtLeastOne === pickedYes ? "WIN" : "LOSE";
}

/** Авто-расчёт ставки на точный счёт BO3. */
export function resolveExactScoreBetStatus(
  bet: Bet,
  match: Pick<Match, "format" | "score1" | "score2">
): BetStatus | null {
  if (bet.status !== "WAIT" || bet.betMarket !== "exactScore") return null;
  if (match.format !== "BO3" || getMatchSeriesWinner(match) == null) return null;
  if (!hasMatchScore(match)) return null;
  if (bet.exactScore1 == null || bet.exactScore2 == null) return null;

  const matchesScore =
    match.score1 === bet.exactScore1 && match.score2 === bet.exactScore2;
  return matchesScore ? "WIN" : "LOSE";
}

/** Авто-расчёт ставки на количество карт (тотал 2,5 в BO3). */
export function resolveMapsTotalBetStatus(bet: Bet, mapsPlayed: number): BetStatus | null {
  if (bet.status !== "WAIT" || bet.betMarket !== "mapsTotal") return null;
  const pickedUnder = bet.betTeam === 1;
  const wins = pickedUnder ? mapsPlayed < 2.5 : mapsPlayed > 2.5;
  return wins ? "WIN" : "LOSE";
}

/** Авто-расчёт возможен для ставок на исход матча и тотал карт. */
export function resolveAutoBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.status !== "WAIT") return null;

  if (bet.betMarket === "mapsTotal") {
    if (match.format !== "BO3" || getMatchSeriesWinner(match) == null) return null;
    const mapsPlayed = getMatchMapsPlayed(match);
    if (mapsPlayed == null) return null;
    return resolveMapsTotalBetStatus(bet, mapsPlayed);
  }

  if (bet.betMarket === "atLeastOneMap") {
    return resolveAtLeastOneMapBetStatus(bet, match);
  }

  if (bet.betMarket === "exactScore") {
    return resolveExactScoreBetStatus(bet, match);
  }

  if (bet.betMarket !== "match") return null;

  const winner = getMatchSeriesWinner(match);
  if (winner == null) return null;
  return bet.betTeam === winner ? "WIN" : "LOSE";
}

export interface BetSettlementPlan {
  bet: Bet;
  nextStatus: BetStatus;
}

export function planMatchBetSettlements(match: Match, bets: Bet[]): BetSettlementPlan[] {
  if (getMatchSeriesWinner(match) == null) return [];

  return findBetsForMatch(match, bets).flatMap((bet) => {
    const nextStatus = resolveAutoBetStatus(bet, match);
    return nextStatus ? [{ bet, nextStatus }] : [];
  });
}

/** WAIT-ставки на карту/пистолет — без данных по картам не рассчитываются. */
export function countSkippedWaitBets(match: Match, bets: Bet[]): number {
  if (getMatchSeriesWinner(match) == null) return 0;

  return findBetsForMatch(match, bets).filter(
    (bet) =>
      bet.status === "WAIT" &&
      bet.betMarket !== "match" &&
      bet.betMarket !== "mapsTotal" &&
      bet.betMarket !== "atLeastOneMap" &&
      bet.betMarket !== "exactScore"
  ).length;
}

export function countPendingMatchBets(match: Match, bets: Bet[]): number {
  return planMatchBetSettlements(match, bets).length;
}

export interface MatchSettlementResult {
  settled: number;
  skipped: number;
}
