import type { Bet, BetStatus } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { betTeamOnMatch, seriesScoreForBet } from "@/features/matches/lib/betTeamAlignment";
import { findBetsForMatch } from "@/features/matches/lib/findBetsForMatch";
import {
  getMapWinner,
  getMatchSeriesScore,
  mapsNeededToWin,
  normalizeMapsForFormat,
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

/** Авто-расчёт ставки на победу на карте */
export function resolveMapBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.betMarket !== "map") return null;
  if (bet.mapNumber == null) return null;

  const maps = normalizeMapsForFormat(match.maps, match.format);
  const mapIndex = bet.mapNumber - 1;
  if (mapIndex < 0 || mapIndex >= maps.length) return null;

  const winner = getMapWinner(maps[mapIndex]);
  if (winner == null) return null;

  return betTeamOnMatch(bet, match) === winner ? "WIN" : "LOSE";
}

/** Авто-расчёт ставки «возьмёт хотя бы одну карту» */
export function resolveAtLeastOneMapBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.betMarket !== "atLeastOneMap") return null;
  if (match.format === "BO1" || !hasMatchScore(match)) return null;

  const series = getMatchSeriesScore(match);
  if (!series) return null;

  const teamOnMatch = betTeamOnMatch(bet, match);
  const mapsWon = teamOnMatch === 1 ? series.score1 : series.score2;
  const pickedYes = bet.yesNo === true;

  if (pickedYes && mapsWon >= 1) return "WIN";
  if (!pickedYes && mapsWon >= 1) return "LOSE";

  const winner = getMatchSeriesWinner(match);
  if (winner != null && mapsWon === 0) return pickedYes ? "LOSE" : "WIN";

  return null;
}

/** Авто-расчёт ставки на точный счёт BO3 */
export function resolveExactScoreBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.betMarket !== "exactScore") return null;
  if (match.format !== "BO3" || getMatchSeriesWinner(match) == null) return null;
  if (!hasMatchScore(match)) return null;
  if (bet.exactScore1 == null || bet.exactScore2 == null) return null;

  const series = getMatchSeriesScore(match);
  if (!series) return null;

  const aligned = seriesScoreForBet(bet, match, series);
  const matchesScore =
    aligned.score1 === bet.exactScore1 && aligned.score2 === bet.exactScore2;
  return matchesScore ? "WIN" : "LOSE";
}

/** Авто-расчёт ставки на количество карт (тотал 2,5 в BO3) */
export function resolveMapsTotalBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.betMarket !== "mapsTotal") return null;
  if (match.format !== "BO3") return null;

  const mapsPlayed = getMatchMapsPlayed(match);
  if (mapsPlayed == null) return null;

  const pickedUnder = bet.betTeam === 1;
  const seriesOver = getMatchSeriesWinner(match) != null;

  if (!pickedUnder && mapsPlayed >= 3) return "WIN";
  if (pickedUnder && mapsPlayed >= 3) return "LOSE";
  if (pickedUnder && mapsPlayed === 2 && seriesOver) return "WIN";
  if (!pickedUnder && mapsPlayed === 2 && seriesOver) return "LOSE";

  return null;
}

/** Ожидаемый статус ставки по текущему счёту матча (кроме пистолетного раунда). */
export function resolveExpectedBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.betMarket === "pistol") return null;

  if (bet.betMarket === "map") {
    return resolveMapBetStatus(bet, match);
  }

  if (bet.betMarket === "mapsTotal") {
    return resolveMapsTotalBetStatus(bet, match);
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
  return betTeamOnMatch(bet, match) === winner ? "WIN" : "LOSE";
}

/** Авто-расчёт WAIT-ставки */
export function resolveAutoBetStatus(bet: Bet, match: Match): BetStatus | null {
  if (bet.status !== "WAIT") return null;
  return resolveExpectedBetStatus(bet, match);
}

export interface BetSettlementPlan {
  bet: Bet;
  nextStatus: BetStatus;
}

export function planMatchBetSettlements(match: Match, bets: Bet[]): BetSettlementPlan[] {
  return planMatchBetRecalculations(match, bets).filter(({ bet }) => bet.status === "WAIT");
}

/** Пересчёт ставок: новые WAIT и исправление WIN/LOSE после смены счёта. */
export function planMatchBetRecalculations(match: Match, bets: Bet[]): BetSettlementPlan[] {
  return findBetsForMatch(match, bets).flatMap((bet) => {
    const nextStatus = resolveExpectedBetStatus(bet, match);
    if (!nextStatus || bet.status === nextStatus) return [];
    return [{ bet, nextStatus }];
  });
}

/** WAIT-ставки на пистолетный раунд — только вручную */
export function countSkippedWaitBets(match: Match, bets: Bet[]): number {
  return findBetsForMatch(match, bets).filter(
    (bet) => bet.status === "WAIT" && bet.betMarket === "pistol",
  ).length;
}

export function countPendingMatchBets(match: Match, bets: Bet[]): number {
  return planMatchBetRecalculations(match, bets).length;
}

export interface MatchSettlementResult {
  settled: number;
  skipped: number;
}
