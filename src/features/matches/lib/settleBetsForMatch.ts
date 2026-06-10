import type { Bet, BetStatus } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { findBetsForMatch } from "@/features/matches/lib/findBetsForMatch";
import {
  getMatchSeriesScore,
  mapsNeededToWin,
} from "@/features/matches/lib/matchMaps";
import { hasMatchScore } from "@/features/matches/lib/matchScore";

/** Победитель серии по счёту выигранных карт */
export function getMatchSeriesWinner(match: Match): 1 | 2 | null {
  const series = getMatchSeriesScore(match);
  if (!series || series.score1 === series.score2) return null;

  const needed = mapsNeededToWin(match.format);
  if (series.score1 >= needed) return 1;
  if (series.score2 >= needed) return 2;
  return null;
}

/** Сыграно карт в серии (сумма счёта серии) */
export function getMatchMapsPlayed(match: Match): number | null {
  const series = getMatchSeriesScore(match);
  if (!series) return null;
  return series.score1 + series.score2;
}

/** Авто-расчёт ставки «возьмёт хотя бы одну карту» */
export function resolveAtLeastOneMapBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.status !== "WAIT" || bet.betMarket !== "atLeastOneMap") return null;
  if (match.format === "BO1" || getMatchSeriesWinner(match) == null) return null;
  if (!hasMatchScore(match)) return null;

  const series = getMatchSeriesScore(match);
  if (!series) return null;

  const mapsWon = bet.betTeam === 1 ? series.score1 : series.score2;
  const tookAtLeastOne = mapsWon >= 1;
  const pickedYes = bet.yesNo === true;
  return tookAtLeastOne === pickedYes ? "WIN" : "LOSE";
}

/** Авто-расчёт ставки на точный счёт BO3 */
export function resolveExactScoreBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.status !== "WAIT" || bet.betMarket !== "exactScore") return null;
  if (match.format !== "BO3" || getMatchSeriesWinner(match) == null) return null;
  if (!hasMatchScore(match)) return null;
  if (bet.exactScore1 == null || bet.exactScore2 == null) return null;

  const series = getMatchSeriesScore(match);
  if (!series) return null;

  const matchesScore =
    series.score1 === bet.exactScore1 && series.score2 === bet.exactScore2;
  return matchesScore ? "WIN" : "LOSE";
}

/** Авто-расчёт ставки на количество карт (тотал 2,5 в BO3) */
export function resolveMapsTotalBetStatus(bet: Bet, mapsPlayed: number): BetStatus | null {
  if (bet.status !== "WAIT" || bet.betMarket !== "mapsTotal") return null;
  const pickedUnder = bet.betTeam === 1;
  const wins = pickedUnder ? mapsPlayed < 2.5 : mapsPlayed > 2.5;
  return wins ? "WIN" : "LOSE";
}

/** Авто-расчёт возможен для ставок на исход матча и тотал карт */
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

/** WAIT-ставки на карту/пистолет — без данных по картам не рассчитываются */
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
