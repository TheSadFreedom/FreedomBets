import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";

const norm = (value: string) => value.trim().toLowerCase();

type TeamPair = Pick<Bet, "organization1" | "organization2">;

/** Совпадает ли порядок команд в ставке и матче. */
export function teamsSameOrder(bet: TeamPair, match: TeamPair): boolean {
  return (
    norm(bet.organization1) === norm(match.organization1) &&
    norm(bet.organization2) === norm(match.organization2)
  );
}

/** Номер команды из ставки в координатах матча (organization1 / organization2). */
export function betTeamOnMatch(bet: Bet, match: Match): 1 | 2 {
  if (bet.betTeam !== 1 && bet.betTeam !== 2) {
    return bet.betTeam as 1 | 2;
  }
  if (teamsSameOrder(bet, match)) return bet.betTeam;
  return bet.betTeam === 1 ? 2 : 1;
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
