import type { Bet } from "@/entities/bet";
import type { EventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { isEventFinished } from "@/features/events/lib/eventStatus";
import { resolveEventTierForEvent } from "@/features/events/lib/eventTier";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { mergeEventTitle } from "@/features/events/lib/eventTitle";

export function parseLegacyEvent(event: string): Pick<Bet, "eventId" | "eventName"> {
  const trimmed = event.trim();
  return { eventId: "", eventName: trimmed };
}

export function formatEventLabel(
  _eventOrganization: string,
  eventName: string,
  _options?: { eventTier?: EventTier }
): string {
  return mergeEventTitle("", eventName);
}

export function eventStatsKey(eventId: string, eventName: string): string {
  return `${eventId.trim()}\0${eventName.trim()}`;
}

export function eventKeyFromBet(bet: Pick<Bet, "eventId" | "eventName">): string {
  return eventStatsKey(bet.eventId, bet.eventName);
}

export interface EventSelectOption {
  key: string;
  eventId: string;
  eventName: string;
  /** @deprecated legacy UI label */
  eventOrganization?: string;
  logoSlug: string | null;
  eventTier: EventTier;
  label: string;
}

export function resolveEventLogoSlug(
  eventId: string,
  eventName: string,
  storedEvents: EventRecord[] = []
): string | null {
  return findStoredEvent({ id: eventId, name: eventName }, storedEvents)?.logoSlug ?? null;
}

export interface GetEventSelectOptionsParams {
  excludeFinished?: boolean;
}

type EventSelectSource = {
  eventId: string;
  eventName: string;
  eventTier?: EventTier;
};

function resolveSourceTier(item: EventSelectSource, storedEvents: EventRecord[]): EventTier {
  if (item.eventTier) return item.eventTier;
  return resolveEventTierForEvent(storedEvents, item.eventId, item.eventName);
}

export function eventSelectKey(
  item: Pick<Bet, "eventId" | "eventName"> & { eventTier?: EventTier }
): string {
  return eventStatsKey(item.eventId, item.eventName);
}

export function getEventSelectOptions(
  bets: Bet[],
  storedEvents: EventRecord[] = [],
  extra?: Pick<Bet, "eventId" | "eventName"> | null,
  params?: GetEventSelectOptionsParams
): EventSelectOption[] {
  const excludeFinished = params?.excludeFinished ?? false;
  const map = new Map<
    string,
    {
      eventId: string;
      eventName: string;
      eventTier: EventTier;
    }
  >();

  const add = (item: EventSelectSource) => {
    const eventTier = resolveSourceTier(item, storedEvents);
    const key = eventSelectKey(item);
    if (!map.has(key)) {
      map.set(key, {
        eventId: item.eventId,
        eventName: item.eventName,
        eventTier,
      });
    }
  };

  for (const bet of bets) add(bet);

  for (const event of storedEvents) {
    add({
      eventId: event.id,
      eventName: event.name,
      eventTier: event.size ?? event.eventTier,
    });
  }

  if (extra && (extra.eventId.trim() || extra.eventName.trim())) {
    add({
      eventId: extra.eventId,
      eventName: extra.eventName,
    });
  }

  return Array.from(map.entries())
    .filter(([key, item]) => {
      if (!excludeFinished) return true;
      const isExtra =
        extra &&
        key ===
          eventSelectKey({
            eventId: extra.eventId,
            eventName: extra.eventName,
          });
      if (isExtra) return true;
      return !isEventFinished(item.eventId, item.eventName, storedEvents);
    })
    .map(([key, item]) => ({
      key,
      ...item,
      eventOrganization: item.eventName,
      logoSlug: resolveEventLogoSlug(item.eventId, item.eventName, storedEvents),
      label: formatEventLabel("", item.eventName, {
        eventTier: item.eventTier,
      }),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));
}
