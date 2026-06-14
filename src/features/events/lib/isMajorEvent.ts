import type { Bet } from "@/entities/bet";
import type { EventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { resolveBetEventTier } from "@/features/events/lib/eventTier";

export function isMajorBet(
  bet: Pick<Bet, "eventId" | "eventName">,
  events: EventRecord[] = []
): boolean {
  return resolveBetEventTier(bet, events) === "Major";
}

export function filterMajorBets(bets: Bet[], events: EventRecord[] = []): Bet[] {
  return bets.filter((bet) => isMajorBet(bet, events));
}

export function filterNonMajorBets(bets: Bet[], events: EventRecord[] = []): Bet[] {
  return bets.filter((bet) => !isMajorBet(bet, events));
}

export function filterBetsByTier(
  bets: Bet[],
  tier: EventTier,
  events: EventRecord[] = []
): Bet[] {
  return bets.filter((bet) => resolveBetEventTier(bet, events) === tier);
}
