import type { Bet } from "@/entities/bet";
import { type EventTier, isEventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";

/** Major — если в названии есть «major»; иначе Small */
export function inferEventTier(eventOrganization: string, eventName: string): EventTier {
  if (/major/i.test(`${eventOrganization} ${eventName}`)) return "Major";
  return "Small";
}

export function resolveEventTier(
  value: unknown,
  eventOrganization: string,
  eventName: string
): EventTier {
  if (isEventTier(value)) return value;
  return inferEventTier(eventOrganization, eventName);
}

export function findEventTier(
  events: EventRecord[],
  eventOrganization: string,
  eventName: string
): EventTier | undefined {
  const record = findStoredEvent({ eventOrganization, eventName }, events);
  return record?.eventTier;
}

export function resolveEventTierForEvent(
  events: EventRecord[],
  eventOrganization: string,
  eventName: string
): EventTier {
  return (
    findEventTier(events, eventOrganization, eventName) ??
    inferEventTier(eventOrganization, eventName)
  );
}

/** Тир турнира для ставки — из сохранённой записи турнира */
export function resolveBetEventTier(
  bet: Pick<Bet, "eventOrganization" | "eventName" | "majorStage">,
  events: EventRecord[] = []
): EventTier {
  return resolveEventTierForEvent(events, bet.eventOrganization, bet.eventName);
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
