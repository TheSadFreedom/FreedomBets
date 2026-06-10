import { useMemo, useState } from "react";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity, EventStats as EventStatsItem } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { EVENT_TIERS, type EventTier } from "@/entities/event";
import { calcEventStatsList } from "@/features/bets/lib/calculations";
import MajorEventGroupCard from "@/features/events/components/MajorEventStats/MajorEventGroupCard";
import { mergeEventStatsWithStored } from "@/features/events/lib/mergeEventStats";
import EventFormDialog from "@/features/events/components/EventFormDialog/EventFormDialog";
import {
  DEFAULT_EVENT_STATS_FILTERS,
  filterEventStatsList,
  filterMajorEventGroups,
  hasActiveEventStatsFilters,
  type EventStatsFilterState,
} from "@/features/events/lib/eventStatsFilters";
import {
  calcStagedEventGroups,
  majorEventGroupKey,
  majorGroupToEventStats,
  type MajorEventGroup,
} from "@/features/events/lib/majorEventStats";
import { eventHasStages } from "@/features/events/lib/eventStages";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { compareStartDate } from "@/features/events/lib/eventStatsSort";
import { buildDeleteEventMessage } from "@/features/events/lib/buildDeleteEventMessage";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import EventStatCard from "./EventStatCard";
import EventStatsSummaryPanel from "./EventStatsSummaryPanel";
import EventStatsFiltersBar from "./EventStatsFiltersBar";
import {
  EventGrid,
  EventScrollArea,
  EventStatsCard,
  EventStatsRoot,
  EmptySearch,
} from "./EventStats.styled";

export interface EventStatsSummarySection {
  title: string;
  bets: Bet[];
  tier?: EventTier;
}

interface EventStatsProps {
  bets: Bet[];
  allBets?: Bet[];
  matches?: Match[];
  events?: EventRecord[];
  emptyMessage?: string;
  notFoundMessage?: string;
  /** Сводная статистика над списком турниров */
  summarySections?: EventStatsSummarySection[];
  /** Показывать фильтр по тиру турнира */
  showTierFilter?: boolean;
  /** Какие тиры доступны в фильтре (по умолчанию — все) */
  tierFilterOptions?: readonly EventTier[];
  /** Фильтр по стадии major */
  showMajorStageFilter?: boolean;
  onUpdateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
  onDeleteEvent: (identity: EventIdentity) => Promise<void>;
}

const eventKey = (org: string, name: string, majorStage?: string | null) =>
  majorStage ? `${org}\0${name}\0${majorStage}` : `${org}\0${name}`;

type EventGridEntry =
  | { type: "group"; data: MajorEventGroup }
  | { type: "flat"; data: EventStatsItem };

const sortEventGridEntries = (entries: EventGridEntry[]): EventGridEntry[] =>
  [...entries].sort((a, b) => {
    const byDate = compareStartDate(a.data.date, b.data.date, "desc");
    if (byDate !== 0) return byDate;

    return `${a.data.eventOrganization} ${a.data.eventName}`.localeCompare(
      `${b.data.eventOrganization} ${b.data.eventName}`,
      "ru"
    );
  });

const EventStats = ({
  bets,
  allBets = bets,
  matches = [],
  events = [],
  emptyMessage = "Нет турниров — нажмите «Новый турнир» в шапке",
  notFoundMessage = "Нет турниров по выбранным фильтрам",
  summarySections,
  tierFilterOptions = EVENT_TIERS,
  onUpdateEvent,
  onDeleteEvent,
}: EventStatsProps) => {
  const [editingEvent, setEditingEvent] = useState<EventStatsItem | null>(null);
  const [editingAllStages, setEditingAllStages] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<EventStatsItem | null>(null);
  const [deletingAllStages, setDeletingAllStages] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState<EventStatsFilterState>(DEFAULT_EVENT_STATS_FILTERS);

  const stats = useMemo(
    () =>
      mergeEventStatsWithStored(calcEventStatsList(bets, events), events, {
        tiers: [...tierFilterOptions],
      }),
    [bets, events, tierFilterOptions]
  );

  const stagedGroups = useMemo(
    () => calcStagedEventGroups(bets, events, { includeTiers: [...tierFilterOptions] }),
    [bets, events, tierFilterOptions]
  );

  const stagedGroupKeys = useMemo(
    () => new Set(stagedGroups.map((group) => majorEventGroupKey(group.eventOrganization, group.eventName))),
    [stagedGroups]
  );

  const flatStats = useMemo(
    () =>
      stats.filter((item) => {
        const key = majorEventGroupKey(item.eventOrganization, item.eventName);
        if (stagedGroupKeys.has(key)) return false;
        const stored = findStoredEvent(item, events);
        return !eventHasStages(stored) && !item.majorStage;
      }),
    [stats, stagedGroupKeys, events]
  );

  const displayedEntries = useMemo(() => {
    const filteredGroups = filterMajorEventGroups(stagedGroups, filters);
    const filteredFlat = filterEventStatsList(flatStats, filters);

    return sortEventGridEntries([
      ...filteredGroups.map((data) => ({ type: "group" as const, data })),
      ...filteredFlat.map((data) => ({ type: "flat" as const, data })),
    ]);
  }, [stagedGroups, flatStats, filters]);

  const displayedCount = displayedEntries.length;
  const totalCount = flatStats.length + stagedGroups.length;

  const hasActiveFilters = hasActiveEventStatsFilters(filters);

  const resetFilters = () => {
    setFilters(DEFAULT_EVENT_STATS_FILTERS);
  };

  const summaryBlock =
    summarySections && summarySections.length > 0 ? (
      <EventStatsSummaryPanel sections={summarySections} />
    ) : null;

  const openDeleteDialog = (item: EventStatsItem, allStages: boolean) => {
    setDeletingAllStages(allStages);
    setDeletingEvent(item);
  };

  const deleteIdentity: EventIdentity | null = deletingEvent
    ? {
        eventOrganization: deletingEvent.eventOrganization,
        eventName: deletingEvent.eventName,
        majorStage: deletingAllStages ? undefined : deletingEvent.majorStage,
        allMajorStages: deletingAllStages,
      }
    : null;

  const deleteDisplayName = deletingEvent
    ? deletingEvent.eventName || deletingEvent.eventOrganization
    : "";

  const handleDeleteConfirm = async () => {
    if (!deleteIdentity) return;
    setDeleting(true);
    try {
      await onDeleteEvent(deleteIdentity);
      setDeletingEvent(null);
      setDeletingAllStages(false);
    } finally {
      setDeleting(false);
    }
  };

  if (totalCount === 0) {
    return (
      <EventStatsRoot>
        {summaryBlock}
        <EmptySearch>{emptyMessage}</EmptySearch>
      </EventStatsRoot>
    );
  }

  return (
    <EventStatsRoot>
      {summaryBlock}

      <EventStatsCard>
        <EventStatsFiltersBar
          search={filters.search}
          onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        <EventScrollArea>
          {displayedCount === 0 ? (
            <EmptySearch>{notFoundMessage}</EmptySearch>
          ) : (
            <EventGrid>
              {displayedEntries.map((entry) => {
                if (entry.type === "group") {
                  const group = entry.data;
                  const stages = filters.filterMajorStage
                    ? group.stages.filter((stage) => stage.majorStage === filters.filterMajorStage)
                    : group.stages;

                  return (
                    <MajorEventGroupCard
                      key={majorEventGroupKey(group.eventOrganization, group.eventName)}
                      group={group}
                      stages={stages}
                      onEditGroup={() => {
                        setEditingAllStages(true);
                        setEditingEvent(majorGroupToEventStats(group));
                      }}
                      onDeleteGroup={() => {
                        openDeleteDialog(majorGroupToEventStats(group), true);
                      }}
                    />
                  );
                }

                const item = entry.data;
                return (
                  <EventStatCard
                    key={eventKey(item.eventOrganization, item.eventName, item.majorStage)}
                    item={item}
                    onEdit={() => {
                      setEditingAllStages(false);
                      setEditingEvent(item);
                    }}
                    onDelete={() => {
                      openDeleteDialog(item, false);
                    }}
                  />
                );
              })}
            </EventGrid>
          )}
        </EventScrollArea>
      </EventStatsCard>

      <EventFormDialog
        open={Boolean(editingEvent)}
        bets={bets}
        initial={editingEvent ?? undefined}
        editEventDates={editingAllStages || !editingEvent?.majorStage}
        onClose={() => {
          setEditingEvent(null);
          setEditingAllStages(false);
        }}
        onSubmit={async (values) => {
          if (!editingEvent) return;
          await onUpdateEvent(
            {
              eventOrganization: editingEvent.eventOrganization,
              eventName: editingEvent.eventName,
              majorStage: editingAllStages ? undefined : editingEvent.majorStage,
              allMajorStages: editingAllStages,
            },
            values
          );
          setEditingEvent(null);
          setEditingAllStages(false);
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingEvent && deleteIdentity)}
        title="Удалить турнир?"
        message={
          deleteIdentity
            ? buildDeleteEventMessage(deleteDisplayName, deleteIdentity, allBets, matches, events)
            : ""
        }
        confirming={deleting}
        onClose={() => {
          if (deleting) return;
          setDeletingEvent(null);
          setDeletingAllStages(false);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </EventStatsRoot>
  );
};

export default EventStats;
