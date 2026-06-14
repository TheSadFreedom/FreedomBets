import { useMemo, useState } from "react";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity, EventStats as EventStatsItem } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { EVENT_TIERS, type EventTier } from "@/entities/event";
import { calcEventStatsList } from "@/features/bets/lib/calculations";
import { mergeEventStatsWithStored } from "@/features/events/lib/mergeEventStats";
import EventFormDialog from "@/features/events/components/EventFormDialog/EventFormDialog";
import {
  DEFAULT_EVENT_STATS_FILTERS,
  filterEventStatsList,
  hasActiveEventStatsFilters,
  type EventStatsFilterState,
} from "@/features/events/lib/eventStatsFilters";
import { storedEventTitle } from "@/features/events/lib/eventTitle";
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
  summarySections?: EventStatsSummarySection[];
  tierFilterOptions?: readonly EventTier[];
  onUpdateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
  onDeleteEvent: (identity: EventIdentity) => Promise<void>;
}

const eventKey = (id: string, name: string) => `${id}\0${name}`;

const EventStats = ({
  bets,
  allBets = bets,
  matches = [],
  events = [],
  emptyMessage = "Нет турниров — нажмите «Новый турнир» внизу экрана",
  notFoundMessage = "Нет турниров по выбранным фильтрам",
  summarySections,
  tierFilterOptions = EVENT_TIERS,
  onUpdateEvent,
  onDeleteEvent,
}: EventStatsProps) => {
  const [editingEvent, setEditingEvent] = useState<EventStatsItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventStatsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState<EventStatsFilterState>(DEFAULT_EVENT_STATS_FILTERS);

  const stats = useMemo(() => {
    const merged = mergeEventStatsWithStored(calcEventStatsList(bets, events), events, {
      tiers: [...tierFilterOptions],
    });
    return [...merged].sort((a, b) => {
      const byDate = compareStartDate(a.date, b.date, "desc");
      if (byDate !== 0) return byDate;
      return storedEventTitle(a).localeCompare(storedEventTitle(b), "ru");
    });
  }, [bets, events, tierFilterOptions]);

  const displayedStats = useMemo(
    () => filterEventStatsList(stats, filters),
    [stats, filters]
  );

  const hasActiveFilters = hasActiveEventStatsFilters(filters);

  const deleteIdentity: EventIdentity | null = deletingEvent
    ? {
        id: deletingEvent.id,
      }
    : null;

  const deleteDisplayName = deletingEvent ? storedEventTitle(deletingEvent) : "";

  const handleDeleteConfirm = async () => {
    if (!deleteIdentity) return;
    setDeleting(true);
    try {
      await onDeleteEvent(deleteIdentity);
      setDeletingEvent(null);
    } finally {
      setDeleting(false);
    }
  };

  const summaryBlock =
    summarySections && summarySections.length > 0 ? (
      <EventStatsSummaryPanel sections={summarySections} />
    ) : null;

  if (stats.length === 0) {
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
          onResetFilters={() => setFilters(DEFAULT_EVENT_STATS_FILTERS)}
        />

        <EventScrollArea>
          {displayedStats.length === 0 ? (
            <EmptySearch>{notFoundMessage}</EmptySearch>
          ) : (
            <EventGrid>
              {displayedStats.map((item) => (
                <EventStatCard
                  key={eventKey(item.id, item.name)}
                  item={item}
                  onEdit={() => setEditingEvent(item)}
                  onDelete={() => setDeletingEvent(item)}
                />
              ))}
            </EventGrid>
          )}
        </EventScrollArea>
      </EventStatsCard>

      <EventFormDialog
        open={Boolean(editingEvent)}
        bets={bets}
        initial={editingEvent ?? undefined}
        onClose={() => setEditingEvent(null)}
        onSubmit={async (values) => {
          if (!editingEvent) return;
          await onUpdateEvent(
            {
              id: editingEvent.id,
            },
            values
          );
          setEditingEvent(null);
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
        }}
        onConfirm={handleDeleteConfirm}
      />
    </EventStatsRoot>
  );
};

export default EventStats;
