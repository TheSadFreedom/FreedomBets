import type { Bet } from "@/entities/bet";
import type { EventStats } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { MAJOR_STAGES } from "@/entities/event";
import {
  calcEventStatsList,
  calcPendingExposure,
  calcSettledProfit,
  calcWinRate,
  countByStatus,
} from "@/features/bets/lib/calculations";
import { compareBetsByDateTimeDesc } from "@/features/bets/lib/sortBets";
import {
  sortEventStatsList,
  type EventStatsSortField,
  type SortDirection,
} from "@/features/events/lib/eventStatsSort";

export interface MajorEventGroup {
  eventOrganization: string;
  eventName: string;
  date: string;
  endDate: string;
  eventTier: "Major";
  totalBets: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
  profit: number;
  pendingExposure: number;
  bets: Bet[];
  stages: EventStats[];
}

export function majorEventGroupKey(eventOrganization: string, eventName: string): string {
  return `${eventOrganization.trim()}\0${eventName.trim()}`;
}

export function majorGroupToEventStats(group: MajorEventGroup): EventStats {
  return {
    eventOrganization: group.eventOrganization,
    eventName: group.eventName,
    date: group.date,
    endDate: group.endDate,
    eventTier: "Major",
    majorStage: null,
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

function stageOrder(stage: EventStats): number {
  if (!stage.majorStage) return MAJOR_STAGES.length;
  const index = MAJOR_STAGES.indexOf(stage.majorStage);
  return index === -1 ? MAJOR_STAGES.length : index;
}

export function calcMajorEventGroups(
  bets: Bet[],
  storedEvents: EventRecord[] = []
): MajorEventGroup[] {
  const stageStats = calcEventStatsList(bets);
  const byMajor = new Map<string, EventStats[]>();

  for (const item of stageStats) {
    const key = majorEventGroupKey(item.eventOrganization, item.eventName);
    const list = byMajor.get(key) ?? [];
    list.push(item);
    byMajor.set(key, list);
  }

  for (const event of storedEvents) {
    if (event.eventTier !== "Major") continue;
    const key = majorEventGroupKey(event.eventOrganization, event.eventName);
    if (!byMajor.has(key)) {
      byMajor.set(key, []);
    }
  }

  return Array.from(byMajor.entries())
    .map(([key, stages]) => {
      const sortedStages = [...stages].sort((a, b) => stageOrder(a) - stageOrder(b));
      const allBets = sortedStages.flatMap((stage) => stage.bets);
      const sortedBets = [...allBets].sort(compareBetsByDateTimeDesc);
      const latest = sortedBets[0];

      const stored = storedEvents.find(
        (event) =>
          event.eventTier === "Major" &&
          majorEventGroupKey(event.eventOrganization, event.eventName) === key
      );

      return {
        eventOrganization: sortedStages[0]?.eventOrganization ?? stored?.eventOrganization ?? "",
        eventName: sortedStages[0]?.eventName ?? stored?.eventName ?? "",
        date: stored?.date ?? latest?.date ?? sortedStages[0]?.date ?? "",
        endDate: stored?.endDate ?? "",
        eventTier: "Major" as const,
        totalBets: allBets.length,
        wins: countByStatus(allBets, "WIN"),
        losses: countByStatus(allBets, "LOSE"),
        pending: countByStatus(allBets, "WAIT"),
        winRate: calcWinRate(allBets),
        profit: calcSettledProfit(allBets),
        pendingExposure: calcPendingExposure(allBets),
        bets: sortedBets,
        stages: sortedStages,
      };
    });
}

function compareIsoDateDesc(a: string, b: string): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return b.localeCompare(a);
}

export function sortMajorEventGroupsByDate(
  items: MajorEventGroup[],
  direction: SortDirection = "desc"
): MajorEventGroup[] {
  const mult = direction === "asc" ? -1 : 1;

  return [...items].sort((a, b) => {
    const byDate = compareIsoDateDesc(a.date, b.date) * mult;
    if (byDate !== 0) return byDate;

    return `${a.eventOrganization} ${a.eventName}`.localeCompare(
      `${b.eventOrganization} ${b.eventName}`,
      "ru"
    );
  });
}

export function sortMajorEventGroups(
  items: MajorEventGroup[],
  field: EventStatsSortField,
  direction: SortDirection
): MajorEventGroup[] {
  if (field === "date") {
    return sortMajorEventGroupsByDate(items, direction);
  }

  return sortEventStatsList(
    items as unknown as EventStats[],
    field,
    direction
  ) as unknown as MajorEventGroup[];
}
