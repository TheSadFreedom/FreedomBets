import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { findLinkedBetsForMatch } from "@/features/matches/lib/findBetsForMatch";

export function findBetsWithMismatchedStage(match: Match, bets: Bet[]): Bet[] {
  const stage = match.majorStage ?? null;
  return findLinkedBetsForMatch(match, bets).filter(
    (bet) => (bet.majorStage ?? null) !== stage
  );
}

export function findBetsWithMismatchedStageByMatchId(
  matches: Match[],
  bets: Bet[]
): Bet[] {
  const stageByMatchId = new Map(matches.map((match) => [match.id, match.majorStage ?? null]));

  return bets.filter((bet) => {
    const matchId = bet.matchId?.trim();
    if (!matchId || !stageByMatchId.has(matchId)) return false;
    return (bet.majorStage ?? null) !== stageByMatchId.get(matchId);
  });
}

export function applyBetStageUpdates(bets: Bet[], savedBets: Bet[]): Bet[] {
  if (savedBets.length === 0) return bets;
  const savedById = new Map(savedBets.map((bet) => [bet.id, bet]));
  return bets.map((bet) => savedById.get(bet.id) ?? bet);
}
