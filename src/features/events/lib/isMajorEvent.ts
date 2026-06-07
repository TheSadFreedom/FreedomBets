import type { Bet } from "@/entities/bet";
import type { EventTier, MajorStage } from "@/entities/event";

export function isMajorBet(bet: Pick<Bet, "eventTier">): boolean {
  return bet.eventTier === "Major";
}

export function filterMajorBets(bets: Bet[]): Bet[] {
  return bets.filter(isMajorBet);
}

export function filterNonMajorBets(bets: Bet[]): Bet[] {
  return bets.filter((bet) => !isMajorBet(bet));
}

export function filterBetsByTier(bets: Bet[], tier: EventTier): Bet[] {
  return bets.filter((bet) => bet.eventTier === tier);
}

export function filterBetsByMajorStage(bets: Bet[], stage: MajorStage): Bet[] {
  return bets.filter((bet) => bet.eventTier === "Major" && bet.majorStage === stage);
}
