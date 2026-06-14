import type { EventStats, EventTier } from "@/entities/event";

import { formatEventLabel } from "@/features/events/lib/eventDisplay";

import { matchesSearchQuery } from "@/shared/lib/search/textSearch";

import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";

export type EventLifecycleFilter = "all" | "active" | "finished";

export interface EventStatsFilterState {
  search: string;
  filterTier: EventTier | "";
  filterLifecycle: EventLifecycleFilter;
}

export const DEFAULT_EVENT_STATS_FILTERS: EventStatsFilterState = {
  search: "",
  filterTier: "",
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
  item: Pick<EventStats, "name" | "size">,
  query: string
): boolean {
  const label = formatEventLabel("", item.name, {
    eventTier: item.size,
  });

  return matchesSearchQuery(
    [item.name, label, item.size],
    query
  );
}

export function hasActiveEventStatsFilters(filters: EventStatsFilterState): boolean {
  return Boolean(
    filters.search.trim() || filters.filterTier || filters.filterLifecycle !== "all"
  );
}

export function filterEventStatsList(
  items: EventStats[],
  filters: EventStatsFilterState,
  today = todayIsoDateLocal()
): EventStats[] {
  return items
    .filter((item) => !filters.filterTier || item.size === filters.filterTier)
    .filter((item) => {
      if (filters.filterLifecycle === "all") return true;
      const finished = isEventStatsFinished(item, today);
      return filters.filterLifecycle === "finished" ? finished : !finished;
    })
    .filter((item) => matchesEventStatsSearch(item, filters.search));
}
