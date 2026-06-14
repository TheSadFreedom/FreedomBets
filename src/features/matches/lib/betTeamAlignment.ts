import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";
import {
  betTeamOnMatchSide,
  teamsSameOrder as teamsSameOrderResolved,
} from "@/entities/team";

/** Совпадает ли порядок команд в ставке и матче (id или синонимы). */
export function teamsSameOrder(bet: Bet, match: Match): boolean {
  return teamsSameOrderResolved(bet, match);
}

/** Номер команды из ставки в координатах матча (organization1 / organization2). */
export function betTeamOnMatch(bet: Bet, match: Match): 1 | 2 {
  return betTeamOnMatchSide(bet, match);
}

/** Счёт серии в координатах ставки (exactScore). */
export function seriesScoreForBet(
  bet: Bet,
  match: Match,
  series: { score1: number; score2: number },
): { score1: number; score2: number } {
  if (teamsSameOrder(bet, match)) return series;
  return { score1: series.score2, score2: series.score1 };
}
