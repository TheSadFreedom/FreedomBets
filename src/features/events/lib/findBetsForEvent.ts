import type { Bet } from "@/entities/bet";
import type { EventIdentity } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { findMatchForBet } from "@/features/matches/lib/findBetsForMatch";

export function isBetInEvent(
  bet: Bet,
  event: EventIdentity,
  _events: EventRecord[] = [],
  matches: Match[] = []
): boolean {
  if (bet.eventId.trim()) return bet.eventId.trim() === event.id;
  const match = findMatchForBet(bet, matches);
  return Boolean(match && match.eventId.trim() === event.id);
}

export function isMatchInEvent(match: Match, event: EventIdentity): boolean {
  return match.eventId.trim() === event.id;
}

export function findBetsForEvent(
  event: EventIdentity,
  bets: Bet[],
  events: EventRecord[] = [],
  matches: Match[] = []
): Bet[] {
  return bets.filter((bet) => isBetInEvent(bet, event, events, matches));
}

export function findMatchesForEvent(event: EventIdentity, matches: Match[]): Match[] {
  return matches.filter((match) => isMatchInEvent(match, event));
}
