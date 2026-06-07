import type { Bet } from "@/entities/bet";
import { type EventTier, isEventTier } from "@/entities/event";
import { eventStatsKey } from "@/features/events/lib/eventDisplay";

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
  bets: Bet[],
  eventOrganization: string,
  eventName: string
): EventTier | undefined {
  const org = eventOrganization.trim();
  const name = eventName.trim();
  if (!org || !name) return undefined;

  const key = eventStatsKey(org, name);
  const match = bets.find(
    (bet) => eventStatsKey(bet.eventOrganization.trim(), bet.eventName.trim()) === key
  );
  return match?.eventTier;
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
