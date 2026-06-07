import type { Bet } from "@/entities/bet";
import type { EventTier, MajorStage } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { isEventFinished } from "@/features/events/lib/eventStatus";
import { formatMajorStageLabel } from "@/features/events/lib/majorStage";

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
  options?: { eventTier?: EventTier; majorStage?: MajorStage | null }
): string {
  const org = eventOrganization.trim();
  const name = eventName.trim();
  const base = name ? `${org} — ${name}` : org;
  if (options?.eventTier === "Major" && options.majorStage) {
    return `${base} · ${formatMajorStageLabel(options.majorStage)}`;
  }
  return base;
}

export function eventStatsKey(
  eventOrganization: string,
  eventName: string,
  majorStage?: MajorStage | null
): string {
  const base = `${eventOrganization.trim()}\0${eventName.trim()}`;
  return majorStage ? `${base}\0${majorStage}` : base;
}

export function eventKeyFromBet(
  bet: Pick<Bet, "eventOrganization" | "eventName" | "eventTier" | "majorStage">
): string {
  const stage = bet.eventTier === "Major" ? bet.majorStage : null;
  return eventStatsKey(bet.eventOrganization, bet.eventName, stage);
}

export interface EventSelectOption {
  key: string;
  eventOrganization: string;
  eventName: string;
  eventTier: EventTier;
  majorStage: MajorStage | null;
  label: string;
}

export interface GetEventSelectOptionsParams {
  excludeFinished?: boolean;
  /** Одна строка на major-ивент; стадия выбирается отдельно */
  collapseMajorStages?: boolean;
}

export function eventSelectKey(
  item: Pick<Bet, "eventOrganization" | "eventName" | "eventTier" | "majorStage">,
  collapseMajorStages = false
): string {
  if (collapseMajorStages && item.eventTier === "Major") {
    return eventStatsKey(item.eventOrganization, item.eventName, null);
  }
  return eventKeyFromBet(item);
}

export function getEventSelectOptions(
  bets: Bet[],
  storedEvents: EventRecord[] = [],
  extra?: Pick<Bet, "eventOrganization" | "eventName" | "eventTier" | "majorStage"> | null,
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
      majorStage: MajorStage | null;
    }
  >();

  const add = (item: Pick<Bet, "eventOrganization" | "eventName" | "eventTier" | "majorStage">) => {
    const key = eventSelectKey(item, collapseMajorStages);
    if (!map.has(key)) {
      map.set(key, {
        eventOrganization: item.eventOrganization,
        eventName: item.eventName,
        eventTier: item.eventTier,
        majorStage:
          item.eventTier === "Major" && !collapseMajorStages ? item.majorStage : null,
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
      eventTier: extra.eventTier ?? "Small",
      majorStage: extra.majorStage ?? null,
    });
  }

  return Array.from(map.entries())
    .filter(([key, item]) => {
      if (!excludeFinished) return true;
      const isExtra = extra && key === eventSelectKey(extra, collapseMajorStages);
      if (isExtra) return true;
      return !isEventFinished(item.eventOrganization, item.eventName, storedEvents);
    })
    .map(([key, item]) => ({
      key,
      ...item,
      label: formatEventLabel(item.eventOrganization, item.eventName, {
        eventTier: item.eventTier,
        majorStage: collapseMajorStages ? null : item.majorStage,
      }),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));
}
