import type { EventStats, EventTier } from "@/entities/event";
import { formatEventLabel } from "@/features/events/lib/eventDisplay";
import type { MajorEventGroup } from "@/features/events/lib/majorEventStats";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";

export type EventLifecycleFilter = "all" | "active" | "finished";

export interface EventStatsFilterState {
  search: string;
  filterOrganization: string;
  filterTier: EventTier | "";
  filterMajorStage: string;
  filterLifecycle: EventLifecycleFilter;
}

export const DEFAULT_EVENT_STATS_FILTERS: EventStatsFilterState = {
  search: "",
  filterOrganization: "",
  filterTier: "",
  filterMajorStage: "",
  filterLifecycle: "all",
};

export function isEventStatsFinished(
  item: Pick<EventStats, "endDate">,
  today = todayIsoDateLocal()
): boolean {
  const endDate = item.endDate?.trim();
  if (!endDate) return false;
  return endDate < today;
}

export function matchesEventStatsSearch(
  item: Pick<EventStats, "eventOrganization" | "eventName" | "eventTier" | "majorStage">,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const org = item.eventOrganization.toLowerCase();
  const name = item.eventName.toLowerCase();
  const label = formatEventLabel(item.eventOrganization, item.eventName, {
    eventTier: item.eventTier,
    majorStage: item.majorStage,
  }).toLowerCase();

  return org.includes(q) || name.includes(q) || label.includes(q);
}

export function hasActiveEventStatsFilters(filters: EventStatsFilterState): boolean {
  return Boolean(
    filters.search.trim() ||
      filters.filterOrganization ||
      filters.filterTier ||
      filters.filterMajorStage ||
      filters.filterLifecycle !== "all"
  );
}

export function filterEventStatsList(
  items: EventStats[],
  filters: EventStatsFilterState,
  today = todayIsoDateLocal()
): EventStats[] {
  return items
    .filter(
      (item) => !filters.filterOrganization || item.eventOrganization === filters.filterOrganization
    )
    .filter((item) => !filters.filterTier || item.eventTier === filters.filterTier)
    .filter((item) => !filters.filterMajorStage || item.majorStage === filters.filterMajorStage)
    .filter((item) => {
      if (filters.filterLifecycle === "all") return true;
      const finished = isEventStatsFinished(item, today);
      return filters.filterLifecycle === "finished" ? finished : !finished;
    })
    .filter((item) => matchesEventStatsSearch(item, filters.search));
}

export function filterMajorEventGroups(
  items: MajorEventGroup[],
  filters: Omit<EventStatsFilterState, "filterTier">,
  today = todayIsoDateLocal()
): MajorEventGroup[] {
  return items
    .filter(
      (item) => !filters.filterOrganization || item.eventOrganization === filters.filterOrganization
    )
    .filter((item) => {
      if (!filters.filterMajorStage) return true;
      return item.stages.some((stage) => stage.majorStage === filters.filterMajorStage);
    })
    .filter((item) => {
      if (filters.filterLifecycle === "all") return true;
      const finished = isEventStatsFinished(item, today);
      return filters.filterLifecycle === "finished" ? finished : !finished;
    })
    .filter((item) =>
      matchesEventStatsSearch(
        { ...item, majorStage: null },
        filters.search
      )
    );
}
