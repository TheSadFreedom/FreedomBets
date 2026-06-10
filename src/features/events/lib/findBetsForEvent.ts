import type { Bet } from "@/entities/bet";
import type { EventIdentity } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { eventHasStages, findEventStages } from "@/features/events/lib/eventStages";
import { resolveBetEventTier } from "@/features/events/lib/eventTier";

export function normalizeEventOrganization(organization: string): string {
  return organization.trim() || "Без организации";
}

function matchesEventBase(
  eventOrganization: string,
  eventName: string,
  identity: EventIdentity
): boolean {
  const orgMatch =
    normalizeEventOrganization(eventOrganization) ===
    normalizeEventOrganization(identity.eventOrganization);
  const nameMatch = eventName.trim() === identity.eventName.trim();
  return orgMatch && nameMatch;
}

export function isBetInEvent(
  bet: Bet,
  event: EventIdentity,
  events: EventRecord[] = []
): boolean {
  if (!matchesEventBase(bet.eventOrganization, bet.eventName, event)) return false;

  const tier = resolveBetEventTier(bet, events);

  if (event.allMajorStages) {
    return true;
  }

  const stages = findEventStages(bet.eventOrganization, bet.eventName, events);
  if (eventHasStages({ eventTier: tier, stages }) || event.majorStage != null || bet.majorStage != null) {
    return bet.majorStage === (event.majorStage ?? null);
  }

  return true;
}

export function isMatchInEvent(match: Match, event: EventIdentity): boolean {
  if (!matchesEventBase(match.eventOrganization, match.eventName, event)) return false;

  if (event.allMajorStages) {
    return true;
  }

  if (match.majorStage != null || event.majorStage != null) {
    return match.majorStage === (event.majorStage ?? null);
  }

  return true;
}

export function findBetsForEvent(
  event: EventIdentity,
  bets: Bet[],
  events: EventRecord[] = []
): Bet[] {
  return bets.filter((bet) => isBetInEvent(bet, event, events));
}

export function findMatchesForEvent(event: EventIdentity, matches: Match[]): Match[] {
  return matches.filter((match) => isMatchInEvent(match, event));
}
