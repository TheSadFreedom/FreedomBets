import type { Bet } from "@/entities/bet";
import { type EventTier, isEventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";

/** Major — если в названии есть «major»; иначе Small */
export function inferEventTier(_eventOrganization: string, eventName: string): EventTier {
  if (/major/i.test(eventName)) return "Major";
  if (/blast|katowice|cologne|masters|championship/i.test(eventName)) return "Big";
  return "Small";
}

export function resolveEventTier(
  value: unknown,
  eventId: string,
  eventName: string
): EventTier {
  if (isEventTier(value)) return value;
  return inferEventTier(eventId, eventName);
}

export function findEventTier(
  events: EventRecord[],
  eventId: string,
  eventName: string
): EventTier | undefined {
  const record = findStoredEvent({ id: eventId, name: eventName }, events);
  if (!record) return undefined;
  if (isEventTier(record.size)) return record.size;
  if (isEventTier(record.eventTier)) return record.eventTier;
  return inferEventTier("", record.name);
}

export function resolveEventTierForEvent(
  events: EventRecord[],
  eventId: string,
  eventName: string
): EventTier {
  return findEventTier(events, eventId, eventName) ?? inferEventTier("", eventName);
}

/** Тир турнира для ставки — из сохранённой записи турнира */
export function resolveBetEventTier(
  bet: Pick<Bet, "eventId" | "eventName">,
  events: EventRecord[] = []
): EventTier {
  return resolveEventTierForEvent(events, bet.eventId, bet.eventName);
}

export const eventTierStyles: Record<
  EventTier,
  { color: string; bg: string; border: string }
> = {
  Major: {
    color: "#ffcc80",
    bg: "rgba(255, 167, 38, 0.14)",
    border: "rgba(255, 167, 38, 0.35)",
  },
  Big: {
    color: "#90caf9",
    bg: "rgba(33, 150, 243, 0.14)",
    border: "rgba(33, 150, 243, 0.35)",
  },
  Small: {
    color: "rgba(255, 255, 255, 0.62)",
    bg: "rgba(255, 255, 255, 0.06)",
    border: "rgba(255, 255, 255, 0.14)",
  },
};
