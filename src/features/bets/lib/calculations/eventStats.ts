import type { Bet } from "@/entities/bet";
import type { EventStats } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { eventStatsKey, resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { resolveEventTierForEvent } from "@/features/events/lib/eventTier";
import {
  calcPendingExposure,
  calcSettledProfit,
  calcWinRate,
  countByStatus,
} from "./basic";
import { compareBetsByDateTimeDesc } from "../sortBets";

export function calcEventStatsList(bets: Bet[], events: EventRecord[] = []): EventStats[] {
  const byEvent = new Map<string, Bet[]>();

  for (const bet of bets) {
    const eventId = bet.eventId.trim();
    const name = bet.eventName.trim();
    const key = eventStatsKey(eventId, name);
    const group = byEvent.get(key) ?? [];
    group.push(bet);
    byEvent.set(key, group);
  }

  return Array.from(byEvent.entries()).map(([key, eventBets]) => {
    const parts = key.split("\0");
    const eventId = parts[0] ?? "";
    const eventName = parts[1] ?? "";
    const sortedBets = [...eventBets].sort(compareBetsByDateTimeDesc);

    const earliest = sortedBets[sortedBets.length - 1];
    const stored = findStoredEvent({ id: eventId, name: eventName }, events);

    return {
      id: eventId || stored?.id || "",
      name: eventName || stored?.name || "",
      logoSlug: stored?.logoSlug ?? resolveEventLogoSlug(eventId, eventName, events),
      winnerTeamId: stored?.winnerTeamId ?? null,
      prizePool: stored?.prizePool ?? null,
      date: stored?.date?.trim() || earliest?.date || "",
      endDate: stored?.endDate?.trim() || "",
      size: resolveEventTierForEvent(events, eventId, eventName),
      totalBets: sortedBets.length,
      wins: countByStatus(sortedBets, "WIN"),
      losses: countByStatus(sortedBets, "LOSE"),
      pending: countByStatus(sortedBets, "WAIT"),
      winRate: calcWinRate(sortedBets),
      profit: calcSettledProfit(sortedBets),
      pendingExposure: calcPendingExposure(sortedBets),
      bets: sortedBets,
    };
  });
}
