import type { Bet } from "@/entities/bet";
import type { EventTier, MajorStage } from "@/entities/event";
import { MAJOR_STAGES } from "@/entities/event";
import type { Match } from "@/entities/match";
import type { EventRecord } from "@/entities/eventRecord";
import { isMajorStage } from "@/entities/event";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { majorStageStyles } from "@/features/events/lib/majorStage";

export function normalizeEventStagesList(stages: unknown): string[] {
  if (!Array.isArray(stages)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of stages) {
    const value = String(item ?? "").trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

export const EVENT_STAGE_QUICK_PRESETS = [
  "Challengers",
  "Legends",
  "Champions",
  "Open Qualifier",
  "Closed Qualifier",
  "Group",
] as const;

export function getEventStageQuickOptions(tier: EventTier): string[] {
  if (tier === "Major") {
    return [...MAJOR_STAGES, ...EVENT_STAGE_QUICK_PRESETS];
  }
  return [...EVENT_STAGE_QUICK_PRESETS];
}

export function defaultStagesForTier(tier: EventTier): string[] {
  return tier === "Major" ? [...MAJOR_STAGES] : [];
}

export function resolveEventStages(
  event: Pick<EventRecord, "eventTier" | "stages"> | null | undefined
): string[] {
  if (!event) return [];
  return normalizeEventStagesList(event.stages);
}

export function eventHasStages(
  event: Pick<EventRecord, "eventTier" | "stages"> | null | undefined
): boolean {
  return resolveEventStages(event).length > 0;
}

function sortInferredStages(
  stages: string[],
  eventTier?: EventTier
): string[] {
  if (eventTier === "Major") {
    const majorOrder = new Map(MAJOR_STAGES.map((stage, index) => [stage, index]));
    return [...stages].sort((a, b) => {
      const left = majorOrder.get(a as MajorStage) ?? MAJOR_STAGES.length;
      const right = majorOrder.get(b as MajorStage) ?? MAJOR_STAGES.length;
      if (left !== right) return left - right;
      return a.localeCompare(b, "ru");
    });
  }
  return [...stages].sort((a, b) => a.localeCompare(b, "ru"));
}

/** Настроенные стадии или стадии из ставок/матчей турнира */
export function inferStagesConfig(
  stored: Pick<EventRecord, "eventTier" | "stages"> | null | undefined,
  stageStats: Array<{ majorStage?: string | null }>
): string[] {
  const configured = resolveEventStages(stored ?? undefined);
  if (configured.length > 0) return configured;

  const inferred = normalizeEventStagesList(stageStats.map((item) => item.majorStage));
  return sortInferredStages(inferred, stored?.eventTier);
}

export function findEventStages(
  eventOrganization: string,
  eventName: string,
  storedEvents: EventRecord[] = []
): string[] {
  const stored = findStoredEvent({ eventOrganization, eventName }, storedEvents);
  return resolveEventStages(stored);
}

type EventStageSource = Pick<Bet, "eventOrganization" | "eventName" | "majorStage">;

function isSameTournament(
  item: EventStageSource,
  eventOrganization: string,
  eventName: string
): boolean {
  return (
    item.eventOrganization.trim() === eventOrganization.trim() &&
    item.eventName.trim() === eventName.trim()
  );
}

/** Стадии турнира: из записи, текущего значения, ставок и матчей */
export function collectEventStages(
  eventOrganization: string,
  eventName: string,
  storedEvents: EventRecord[] = [],
  options?: {
    currentStage?: string | null;
    bets?: EventStageSource[];
    matches?: Array<Pick<Match, "eventOrganization" | "eventName" | "majorStage">>;
  }
): string[] {
  const org = eventOrganization.trim();
  const name = eventName.trim();
  if (!org && !name) return [];

  const result: string[] = [];
  const seen = new Set<string>();
  const add = (stage: string | null | undefined) => {
    const value = stage?.trim();
    if (!value || seen.has(value)) return;
    seen.add(value);
    result.push(value);
  };

  for (const stage of findEventStages(org, name, storedEvents)) {
    add(stage);
  }

  add(options?.currentStage);

  const extra: string[] = [];
  const addExtra = (stage: string | null | undefined) => {
    const value = stage?.trim();
    if (!value || seen.has(value)) return;
    seen.add(value);
    extra.push(value);
  };

  for (const bet of options?.bets ?? []) {
    if (isSameTournament(bet, org, name)) addExtra(bet.majorStage);
  }
  for (const match of options?.matches ?? []) {
    if (isSameTournament(match, org, name)) addExtra(match.majorStage);
  }

  extra.sort((a, b) => a.localeCompare(b, "ru"));
  return [...result, ...extra];
}

export function resolveEventStageValue(
  value: unknown,
  eventOrganization: string,
  eventName: string,
  storedEvents: EventRecord[] = []
): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed) return trimmed;

  const stages = findEventStages(eventOrganization, eventName, storedEvents);
  return stages.length === 1 ? stages[0]! : null;
}

export function pickEventStage(
  eventOrganization: string,
  eventName: string,
  storedEvents: EventRecord[] = [],
  current?: string | null
): string | null {
  const trimmed = current?.trim();
  if (trimmed) return trimmed;

  const stages = findEventStages(eventOrganization, eventName, storedEvents);
  return stages[0] ?? null;
}

export function stageStyleFor(stage: string): { color: string; bg: string; border: string } {
  if (isMajorStage(stage)) {
    return majorStageStyles[stage];
  }
  return {
    color: "#d8d8d8",
    bg: "#363636",
    border: "#4c4c4c",
  };
}
