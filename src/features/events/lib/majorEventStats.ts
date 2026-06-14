import type { Bet } from "@/entities/bet";
import type { EventStats, EventTier } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { eventHasStages, inferStagesConfig } from "@/features/events/lib/eventStages";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import {
  calcEventStatsList,
  calcPendingExposure,
  calcSettledProfit,
  calcWinRate,
  countByStatus,
} from "@/features/bets/lib/calculations";
import { compareBetsByDateTimeDesc } from "@/features/bets/lib/sortBets";
import {
  compareStartDate,
  sortEventStatsList,
  type EventStatsSortField,
  type SortDirection,
} from "@/features/events/lib/eventStatsSort";

export interface MajorEventGroup {
  eventOrganization: string;
  eventName: string;
  logoSlug: string | null;
  date: string;
  endDate: string;
  eventTier: EventTier;
  totalBets: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
  profit: number;
  pendingExposure: number;
  bets: Bet[];
  /** Настроенные стадии турнира */
  stagesConfig: string[];
  stages: EventStats[];
  winnerOrganization: string | null;
  winnerLogoSlug: string | null;
  prizePool: number | null;
}

export function majorEventGroupKey(eventOrganization: string, eventName: string): string {
  return `${eventOrganization.trim()}\0${eventName.trim()}`;
}

export function majorGroupToEventStats(group: MajorEventGroup): EventStats {
  return {
    eventOrganization: group.eventOrganization,
    eventName: group.eventName,
    logoSlug: group.logoSlug,
    date: group.date,
    endDate: group.endDate,
    eventTier: group.eventTier,
    majorStage: null,
    stages: group.stagesConfig,
    winnerOrganization: group.winnerOrganization,
    winnerLogoSlug: group.winnerLogoSlug,
    prizePool: group.prizePool,
    totalBets: group.totalBets,
    wins: group.wins,
    losses: group.losses,
    pending: group.pending,
    winRate: group.winRate,
    profit: group.profit,
    pendingExposure: group.pendingExposure,
    bets: group.bets,
  };
}

function stageOrder(stage: EventStats, config: string[]): number {
  if (!stage.majorStage) return Number.MAX_SAFE_INTEGER;
  const configIndex = config.indexOf(stage.majorStage);
  return configIndex === -1 ? config.length : configIndex;
}

function emptyStageStats(
  base: Pick<
    EventStats,
    | "eventOrganization"
    | "eventName"
    | "logoSlug"
    | "eventTier"
    | "date"
    | "endDate"
    | "stages"
    | "prizePool"
  >,
  stageName: string
): EventStats {
  return {
    ...base,
    majorStage: stageName,
    winnerOrganization: null,
    winnerLogoSlug: null,
    prizePool: base.prizePool ?? null,
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

function mergeConfiguredStageStats(
  stageStats: EventStats[],
  stored: EventRecord | undefined,
  stagesConfig: string[]
): EventStats[] {
  if (stagesConfig.length === 0) return stageStats;

  const byStage = new Map<string, EventStats>();
  const unassigned: EventStats[] = [];

  for (const item of stageStats) {
    if (item.majorStage) {
      byStage.set(item.majorStage, item);
    } else if (item.totalBets > 0) {
      unassigned.push(item);
    }
  }

  const base = stageStats[0] ??
    (stored
      ? {
          eventOrganization: stored.eventOrganization,
          eventName: stored.eventName,
          logoSlug: stored.logoSlug,
          eventTier: stored.eventTier,
          date: stored.date,
          endDate: stored.endDate,
          stages: stagesConfig,
          prizePool: stored.prizePool,
        }
      : null);

  if (!base) return stageStats;

  const merged = stagesConfig.map((stageName) =>
    byStage.get(stageName) ?? emptyStageStats(base, stageName)
  );

  for (const item of stageStats) {
    if (item.majorStage && !stagesConfig.includes(item.majorStage)) {
      merged.push(item);
    }
  }

  return [...merged, ...unassigned];
}

function buildEventGroup(
  key: string,
  stages: EventStats[],
  storedEvents: EventRecord[],
  fallbackTier: EventTier
): MajorEventGroup {
  const stored = storedEvents.find(
    (event) => majorEventGroupKey(event.eventOrganization, event.eventName) === key
  );
  const stagesConfig = inferStagesConfig(stored, stages);
  const mergedStages = mergeConfiguredStageStats(stages, stored, stagesConfig);
  const sortedStages = [...mergedStages].sort((a, b) => stageOrder(a, stagesConfig) - stageOrder(b, stagesConfig));
  const allBets = sortedStages.flatMap((stage) => stage.bets);
  const sortedBets = [...allBets].sort(compareBetsByDateTimeDesc);
  const earliest = sortedBets[sortedBets.length - 1];

  return {
    eventOrganization: sortedStages[0]?.eventOrganization ?? stored?.eventOrganization ?? "",
    eventName: sortedStages[0]?.eventName ?? stored?.eventName ?? "",
    logoSlug: stored?.logoSlug ?? sortedStages[0]?.logoSlug ?? null,
    date: stored?.date?.trim() || earliest?.date || sortedStages[0]?.date || "",
    endDate: stored?.endDate ?? "",
    eventTier: stored?.eventTier ?? sortedStages[0]?.eventTier ?? fallbackTier,
    totalBets: allBets.length,
    wins: countByStatus(allBets, "WIN"),
    losses: countByStatus(allBets, "LOSE"),
    pending: countByStatus(allBets, "WAIT"),
    winRate: calcWinRate(allBets),
    profit: calcSettledProfit(allBets),
    pendingExposure: calcPendingExposure(allBets),
    bets: sortedBets,
    stagesConfig,
    stages: sortedStages,
    winnerOrganization: stored?.winnerOrganization ?? null,
    winnerLogoSlug: stored?.winnerLogoSlug ?? null,
    prizePool: stored?.prizePool ?? null,
  };
}

function isTierAllowed(
  tier: EventTier,
  options?: { excludeTiers?: EventTier[]; includeTiers?: EventTier[] }
): boolean {
  if (options?.excludeTiers?.includes(tier)) return false;
  if (options?.includeTiers && !options.includeTiers.includes(tier)) return false;
  return true;
}

export function calcStagedEventGroups(
  bets: Bet[],
  storedEvents: EventRecord[] = [],
  options?: { excludeTiers?: EventTier[]; includeTiers?: EventTier[] }
): MajorEventGroup[] {
  const stageStats = calcEventStatsList(bets, storedEvents);
  const byEvent = new Map<string, EventStats[]>();

  for (const item of stageStats) {
    if (!isTierAllowed(item.eventTier, options)) continue;
    const stored = findStoredEvent(item, storedEvents);
    if (!eventHasStages(stored) && !item.majorStage?.trim()) continue;
    const key = majorEventGroupKey(item.eventOrganization, item.eventName);
    const list = byEvent.get(key) ?? [];
    list.push(item);
    byEvent.set(key, list);
  }

  for (const event of storedEvents) {
    if (!isTierAllowed(event.eventTier, options)) continue;
    if (!eventHasStages(event)) continue;
    const key = majorEventGroupKey(event.eventOrganization, event.eventName);
    if (!byEvent.has(key)) {
      byEvent.set(key, []);
    }
  }

  const groups = Array.from(byEvent.entries()).map(([key, stages]) =>
    buildEventGroup(key, stages, storedEvents, stages[0]?.eventTier ?? "Small")
  );

  return sortMajorEventGroupsByStartDateDesc(groups);
}

export function sortMajorEventGroupsByDate(
  items: MajorEventGroup[],
  direction: SortDirection = "desc"
): MajorEventGroup[] {
  return [...items].sort((a, b) => {
    const byDate = compareStartDate(a.date, b.date, direction);
    if (byDate !== 0) return byDate;

    return `${a.eventOrganization} ${a.eventName}`.localeCompare(
      `${b.eventOrganization} ${b.eventName}`,
      "ru"
    );
  });
}

export function sortMajorEventGroupsByStartDateDesc(
  items: MajorEventGroup[]
): MajorEventGroup[] {
  return sortMajorEventGroupsByDate(items, "desc");
}

export function sortMajorEventGroups(
  items: MajorEventGroup[],
  field: EventStatsSortField,
  direction: SortDirection
): MajorEventGroup[] {
  if (field === "date" || field === "endDate") {
    if (field === "endDate") {
      return sortEventStatsList(
        items as unknown as EventStats[],
        field,
        direction
      ) as unknown as MajorEventGroup[];
    }
    return sortMajorEventGroupsByDate(items, direction);
  }

  return sortEventStatsList(
    items as unknown as EventStats[],
    field,
    direction
  ) as unknown as MajorEventGroup[];
}
