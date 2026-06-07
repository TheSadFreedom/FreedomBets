import type { EventStats, EventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { eventStatsKey } from "@/features/events/lib/eventDisplay";

function storedEventToStats(event: EventRecord): EventStats {
  return {
    eventOrganization: event.eventOrganization,
    eventName: event.eventName,
    date: event.date,
    endDate: event.endDate,
    eventTier: event.eventTier,
    majorStage: null,
    totalBets: 0,
    wins: 0,
    losses: 0,
    pending: 0,
    winRate: 0,
    profit: 0,
    pendingExposure: 0,
    bets: [],
  };
}

export function findStoredEvent(
  identity: { eventOrganization: string; eventName: string },
  events: EventRecord[]
): EventRecord | undefined {
  const org = identity.eventOrganization.trim();
  const name = identity.eventName.trim();
  return events.find(
    (event) => event.eventOrganization.trim() === org && event.eventName.trim() === name
  );
}

export function mergeEventStatsWithStored(
  betStats: EventStats[],
  storedEvents: EventRecord[],
  options?: { tiers?: EventTier[] }
): EventStats[] {
  const allowedTiers = options?.tiers ? new Set(options.tiers) : null;
  const byKey = new Map<string, EventStats>();

  for (const stat of betStats) {
    byKey.set(eventStatsKey(stat.eventOrganization, stat.eventName, stat.majorStage), stat);
  }

  for (const event of storedEvents) {
    if (allowedTiers && !allowedTiers.has(event.eventTier)) continue;

    const key = eventStatsKey(event.eventOrganization, event.eventName, null);
    const existing = byKey.get(key);
    if (existing) {
      byKey.set(key, {
        ...existing,
        date: event.date || existing.date,
        endDate: event.endDate,
        eventTier: event.eventTier,
      });
      continue;
    }
    byKey.set(key, storedEventToStats(event));
  }

  return Array.from(byKey.values());
}
