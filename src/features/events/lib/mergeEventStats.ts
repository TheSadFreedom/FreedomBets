import type { EventStats, EventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { eventStatsKey } from "@/features/events/lib/eventDisplay";
import { storedEventTitle } from "@/features/events/lib/eventTitle";

function storedEventToStats(event: EventRecord): EventStats {
  const size = event.size ?? event.eventTier ?? "Small";
  return {
    id: event.id,
    name: storedEventTitle(event),
    logoSlug: event.logoSlug,
    date: event.date,
    endDate: event.endDate,
    size,
    winnerTeamId: event.winnerTeamId,
    prizePool: event.prizePool,
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
  identity: { id: string; name?: string },
  events: EventRecord[]
): EventRecord | undefined {
  const id = identity.id.trim();
  if (id) return events.find((event) => event.id.trim() === id);
  const name = identity.name?.trim().toLowerCase();
  if (!name) return undefined;
  return events.find((event) => storedEventTitle(event).toLowerCase() === name);
}

export function mergeEventStatsWithStored(
  betStats: EventStats[],
  storedEvents: EventRecord[],
  options?: { tiers?: EventTier[] }
): EventStats[] {
  const allowedTiers = options?.tiers ? new Set(options.tiers) : null;
  const byKey = new Map<string, EventStats>();

  for (const stat of betStats) {
    const stored = findStoredEvent({ id: stat.id, name: stat.name }, storedEvents);
    const key = eventStatsKey(stat.id, stat.name);
    byKey.set(key, {
      ...stat,
      date: stored?.date?.trim() || stat.date,
      endDate: stored?.endDate?.trim() || stat.endDate,
      size: stored?.size ?? stored?.eventTier ?? stat.size,
      logoSlug: stored?.logoSlug ?? stat.logoSlug,
      winnerTeamId: stored?.winnerTeamId ?? stat.winnerTeamId ?? null,
      prizePool: stored?.prizePool ?? stat.prizePool ?? null,
    });
  }

  for (const event of storedEvents) {
    const eventSize = event.size ?? event.eventTier ?? "Small";
    if (allowedTiers && !allowedTiers.has(eventSize)) continue;

    const key = eventStatsKey(event.id, event.name);
    const existing = byKey.get(key);
    if (existing) {
      byKey.set(key, {
        ...existing,
        date: event.date || existing.date,
        endDate: event.endDate,
        size: event.size ?? event.eventTier ?? existing.size,
        logoSlug: event.logoSlug ?? existing.logoSlug,
        winnerTeamId: event.winnerTeamId ?? existing.winnerTeamId ?? null,
        prizePool: event.prizePool ?? existing.prizePool ?? null,
      });
      continue;
    }
    byKey.set(key, storedEventToStats(event));
  }

  return Array.from(byKey.values());
}
