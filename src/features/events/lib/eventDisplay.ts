import type { Bet } from "@/entities/bet";
import type { EventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { isEventFinished } from "@/features/events/lib/eventStatus";
import { resolveEventTierForEvent } from "@/features/events/lib/eventTier";
import { formatMajorStageLabel } from "@/features/events/lib/majorStage";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";

export function parseLegacyEvent(event: string): Pick<Bet, "eventOrganization" | "eventName"> {
  const trimmed = event.trim();
  if (!trimmed) return { eventOrganization: "", eventName: "" };
  const space = trimmed.indexOf(" ");
  if (space === -1) return { eventOrganization: trimmed, eventName: "" };
  return {
    eventOrganization: trimmed.slice(0, space),
    eventName: trimmed.slice(space + 1).trim(),
  };
}

export function formatEventLabel(
  eventOrganization: string,
  eventName: string,
  options?: { eventTier?: EventTier; majorStage?: string | null }
): string {
  const org = eventOrganization.trim();
  const name = eventName.trim();
  const base = name ? `${org} — ${name}` : org;
  if (options?.majorStage) {
    return `${base} · ${formatMajorStageLabel(options.majorStage)}`;
  }
  return base;
}

export function eventStatsKey(
  eventOrganization: string,
  eventName: string,
  majorStage?: string | null
): string {
  const base = `${eventOrganization.trim()}\0${eventName.trim()}`;
  return majorStage ? `${base}\0${majorStage}` : base;
}

export function eventKeyFromBet(
  bet: Pick<Bet, "eventOrganization" | "eventName" | "majorStage">
): string {
  return eventStatsKey(bet.eventOrganization, bet.eventName, bet.majorStage);
}

export interface EventSelectOption {
  key: string;
  eventOrganization: string;
  eventName: string;
  logoSlug: string | null;
  eventTier: EventTier;
  majorStage: string | null;
  label: string;
}

export function resolveEventLogoSlug(
  eventOrganization: string,
  eventName: string,
  storedEvents: EventRecord[] = []
): string | null {
  return findStoredEvent({ eventOrganization, eventName }, storedEvents)?.logoSlug ?? null;
}

export interface GetEventSelectOptionsParams {
  excludeFinished?: boolean;
  /** Одна строка на турнир со стадиями; стадия выбирается отдельно */
  collapseMajorStages?: boolean;
}

type EventSelectSource = {
  eventOrganization: string;
  eventName: string;
  majorStage?: string | null;
  eventTier?: EventTier;
};

function resolveSourceTier(
  item: EventSelectSource,
  storedEvents: EventRecord[]
): EventTier {
  if (item.eventTier) return item.eventTier;
  return resolveEventTierForEvent(storedEvents, item.eventOrganization, item.eventName);
}

export function eventSelectKey(
  item: Pick<Bet, "eventOrganization" | "eventName" | "majorStage"> & { eventTier?: EventTier },
  _storedEvents: EventRecord[],
  collapseMajorStages = false
): string {
  if (collapseMajorStages) {
    return eventStatsKey(item.eventOrganization, item.eventName, null);
  }
  return eventKeyFromBet(item);
}

export function getEventSelectOptions(
  bets: Bet[],
  storedEvents: EventRecord[] = [],
  extra?: Pick<Bet, "eventOrganization" | "eventName" | "majorStage"> | null,
  params?: GetEventSelectOptionsParams
): EventSelectOption[] {
  const excludeFinished = params?.excludeFinished ?? false;
  const collapseMajorStages = params?.collapseMajorStages ?? false;
  const map = new Map<
    string,
    {
      eventOrganization: string;
      eventName: string;
      eventTier: EventTier;
      majorStage: string | null;
    }
  >();

  const add = (item: EventSelectSource) => {
    const eventTier = resolveSourceTier(item, storedEvents);
    const key = eventSelectKey(
      { ...item, majorStage: item.majorStage ?? null },
      storedEvents,
      collapseMajorStages
    );
    if (!map.has(key)) {
      map.set(key, {
        eventOrganization: item.eventOrganization,
        eventName: item.eventName,
        eventTier,
        majorStage: !collapseMajorStages ? item.majorStage ?? null : null,
      });
    }
  };

  for (const bet of bets) add(bet);

  for (const event of storedEvents) {
    add({
      eventOrganization: event.eventOrganization,
      eventName: event.eventName,
      eventTier: event.eventTier,
      majorStage: null,
    });
  }

  if (extra && (extra.eventOrganization.trim() || extra.eventName.trim())) {
    add({
      eventOrganization: extra.eventOrganization,
      eventName: extra.eventName,
      majorStage: extra.majorStage ?? null,
    });
  }

  return Array.from(map.entries())
    .filter(([key, item]) => {
      if (!excludeFinished) return true;
      const isExtra =
        extra &&
        key ===
          eventSelectKey(
            {
              eventOrganization: extra.eventOrganization,
              eventName: extra.eventName,
              majorStage: extra.majorStage ?? null,
            },
            storedEvents,
            collapseMajorStages
          );
      if (isExtra) return true;
      return !isEventFinished(item.eventOrganization, item.eventName, storedEvents);
    })
    .map(([key, item]) => ({
      key,
      ...item,
      logoSlug: resolveEventLogoSlug(item.eventOrganization, item.eventName, storedEvents),
      label: formatEventLabel(item.eventOrganization, item.eventName, {
        eventTier: item.eventTier,
        majorStage: collapseMajorStages ? null : item.majorStage,
      }),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));
}
