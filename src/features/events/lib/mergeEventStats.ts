import type { EventStats, EventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { eventStatsKey } from "@/features/events/lib/eventDisplay";
import { normalizeEventStagesList } from "@/features/events/lib/eventStages";

function storedEventToStats(event: EventRecord): EventStats {
  return {
    eventOrganization: event.eventOrganization,
    eventName: event.eventName,
    logoSlug: event.logoSlug,
    date: event.date,
    endDate: event.endDate,
    eventTier: event.eventTier,
    majorStage: null,
    stages: normalizeEventStagesList(event.stages),
    winnerOrganization: event.winnerOrganization,
    winnerLogoSlug: event.winnerLogoSlug,
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
    const stored = findStoredEvent(stat, storedEvents);
    const key = eventStatsKey(stat.eventOrganization, stat.eventName, stat.majorStage);
    byKey.set(key, {
      ...stat,
      date: stored?.date?.trim() || stat.date,
      endDate: stored?.endDate?.trim() || stat.endDate,
      eventTier: stored?.eventTier ?? stat.eventTier,
      logoSlug: stored?.logoSlug ?? stat.logoSlug,
      stages: stored ? normalizeEventStagesList(stored.stages) : stat.stages,
      winnerOrganization: stored?.winnerOrganization ?? stat.winnerOrganization ?? null,
      winnerLogoSlug: stored?.winnerLogoSlug ?? stat.winnerLogoSlug ?? null,
    });
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
        logoSlug: event.logoSlug ?? existing.logoSlug,
        stages: normalizeEventStagesList(event.stages),
        winnerOrganization: event.winnerOrganization ?? existing.winnerOrganization ?? null,
        winnerLogoSlug: event.winnerLogoSlug ?? existing.winnerLogoSlug ?? null,
      });
      continue;
    }
    byKey.set(key, storedEventToStats(event));
  }

  return Array.from(byKey.values());
}
