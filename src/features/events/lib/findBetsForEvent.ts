import type { Bet } from "@/entities/bet";
import type { EventIdentity } from "@/entities/event";
import type { Match } from "@/entities/match";

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

export function isBetInEvent(bet: Bet, event: EventIdentity): boolean {
  if (!matchesEventBase(bet.eventOrganization, bet.eventName, event)) return false;

  if (event.allMajorStages) {
    return bet.eventTier === "Major";
  }

  if (bet.eventTier === "Major" || event.majorStage != null) {
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

export function findBetsForEvent(event: EventIdentity, bets: Bet[]): Bet[] {
  return bets.filter((bet) => isBetInEvent(bet, event));
}

export function findMatchesForEvent(event: EventIdentity, matches: Match[]): Match[] {
  return matches.filter((match) => isMatchInEvent(match, event));
}
