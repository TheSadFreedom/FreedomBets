import { useMemo, useState } from "react";
import {
  Chip,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity, EventStats as EventStatsItem } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { EVENT_TIERS, MAJOR_STAGES, type EventTier, type MajorStage } from "@/entities/event";
import { calcEventStatsList } from "@/features/bets/lib/calculations";
import { mergeEventStatsWithStored } from "@/features/events/lib/mergeEventStats";
import EventFormDialog from "@/features/events/components/EventFormDialog/EventFormDialog";
import { formatEventLabel } from "@/features/events/lib/eventDisplay";
import {
  sortEventStatsList,
  type EventStatsSortField,
  type SortDirection,
} from "@/features/events/lib/eventStatsSort";
import SummaryGeneralSection from "@/features/summary/components/StatsSummary/SummaryGeneralSection";
import EventStatCard from "./EventStatCard";
import {
  EventGrid,
  EventScrollArea,
  EventStatsRoot,
  EventStatsToolbar,
  EmptySearch,
  filterControlSx,
} from "./EventStats.styled";

export interface EventStatsSummarySection {
  title: string;
  bets: Bet[];
}

interface EventStatsProps {
  isAdmin?: boolean;
  bets: Bet[];
  events?: EventRecord[];
  emptyMessage?: string;
  notFoundMessage?: string;
  /** Сводная статистика над списком ивентов */
  summarySections?: EventStatsSummarySection[];
  /** Показывать фильтр по статусу ивента */
  showTierFilter?: boolean;
  /** Какие статусы доступны в фильтре (по умолчанию — все) */
  tierFilterOptions?: readonly EventTier[];
  /** Фильтр по стадии major */
  showMajorStageFilter?: boolean;
  onUpdateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
}

const eventKey = (org: string, name: string, majorStage?: MajorStage | null) =>
  majorStage ? `${org}\0${name}\0${majorStage}` : `${org}\0${name}`;

const SORT_FIELD_LABELS: Record<EventStatsSortField, string> = {
  date: "Дата",
  name: "Название",
  totalBets: "Количество ставок",
  winRate: "Винрейт",
  profit: "Профит",
  pendingExposure: "Сумма в игре",
};

const EventStats = ({
  isAdmin = false,
  bets,
  events = [],
  emptyMessage = "Нет ивентов — нажмите «Новый ивент» в шапке",
  notFoundMessage = "Ничего не найдено",
  summarySections,
  showTierFilter = true,
  tierFilterOptions = EVENT_TIERS,
  showMajorStageFilter = false,
  onUpdateEvent,
}: EventStatsProps) => {
  const [editingEvent, setEditingEvent] = useState<EventStatsItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterOrganization, setFilterOrganization] = useState("");
  const [filterTier, setFilterTier] = useState<EventTier | "">("");
  const [filterMajorStage, setFilterMajorStage] = useState<MajorStage | "">("");
  const [sortBy, setSortBy] = useState<EventStatsSortField>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const stats = useMemo(
    () =>
      mergeEventStatsWithStored(calcEventStatsList(bets), events, {
        tiers: [...tierFilterOptions],
      }),
    [bets, events, tierFilterOptions]
  );

  const organizations = useMemo(
    () =>
      Array.from(new Set(stats.map((item) => item.eventOrganization))).sort((a, b) =>
        a.localeCompare(b, "ru")
      ),
    [stats]
  );

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = stats
      .filter(
        (item) => !filterOrganization || item.eventOrganization === filterOrganization
      )
      .filter((item) => !filterTier || item.eventTier === filterTier)
      .filter((item) => !filterMajorStage || item.majorStage === filterMajorStage)
      .filter(
        (item) =>
          !q ||
          item.eventName.toLowerCase().includes(q) ||
          formatEventLabel(item.eventOrganization, item.eventName, {
            eventTier: item.eventTier,
            majorStage: item.majorStage,
          })
            .toLowerCase()
            .includes(q)
      );

    return sortEventStatsList(filtered, sortBy, sortDir);
  }, [stats, search, filterOrganization, filterTier, filterMajorStage, sortBy, sortDir]);

  const hasActiveFilters = Boolean(
    search.trim() || filterOrganization || filterTier || filterMajorStage
  );

  const summaryBlock =
    summarySections && summarySections.length > 0
      ? summarySections
          .filter((section) => section.bets.length > 0)
          .map((section) => (
            <SummaryGeneralSection
              key={section.title}
              title={section.title}
              bets={section.bets}
            />
          ))
      : null;

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
      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
        <Chip
          label={hasActiveFilters ? `${displayed.length} / ${stats.length}` : stats.length}
          size="small"
          variant="outlined"
          sx={{ borderColor: "rgba(76, 175, 80, 0.35)" }}
        />
      </Box>

      <TextField
        size="small"
        fullWidth
        placeholder="Поиск названия ивента..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <EventStatsToolbar>
        {showTierFilter ? (
          <FormControl size="small" sx={filterControlSx}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={filterTier}
              label="Статус"
              onChange={(e) => setFilterTier(e.target.value as EventTier | "")}
            >
              <MenuItem value="">Все</MenuItem>
              {tierFilterOptions.map((tier) => (
                <MenuItem key={tier} value={tier}>
                  {tier}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}

        {showMajorStageFilter ? (
          <FormControl size="small" sx={filterControlSx}>
            <InputLabel>Стадия</InputLabel>
            <Select
              value={filterMajorStage}
              label="Стадия"
              onChange={(e) => setFilterMajorStage(e.target.value as MajorStage | "")}
            >
              <MenuItem value="">Все</MenuItem>
              {MAJOR_STAGES.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}

        <FormControl size="small" sx={filterControlSx}>
          <InputLabel>Организация</InputLabel>
          <Select
            value={filterOrganization}
            label="Организация"
            onChange={(e) => setFilterOrganization(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org} value={org}>
                {org}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={filterControlSx}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortBy}
            label="Сортировка"
            onChange={(e) => setSortBy(e.target.value as EventStatsSortField)}
          >
            {(Object.keys(SORT_FIELD_LABELS) as EventStatsSortField[]).map((field) => (
              <MenuItem key={field} value={field}>
                {SORT_FIELD_LABELS[field]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={filterControlSx}>
          <InputLabel>Порядок</InputLabel>
          <Select
            value={sortDir}
            label="Порядок"
            onChange={(e) => setSortDir(e.target.value as SortDirection)}
          >
            <MenuItem value="asc">По возрастанию</MenuItem>
            <MenuItem value="desc">По убыванию</MenuItem>
          </Select>
        </FormControl>
      </EventStatsToolbar>

      <EventScrollArea>
        {displayed.length === 0 ? (
          <EmptySearch>{notFoundMessage}</EmptySearch>
        ) : (
          <EventGrid>
            {displayed.map((item) => (
              <EventStatCard
                key={eventKey(item.eventOrganization, item.eventName, item.majorStage)}
                item={item}
                showEdit={isAdmin}
                onEdit={() => setEditingEvent(item)}
              />
            ))}
          </EventGrid>
        )}
      </EventScrollArea>
      <EventFormDialog
        open={Boolean(editingEvent)}
        bets={bets}
        initial={editingEvent ?? undefined}
        onClose={() => setEditingEvent(null)}
        onSubmit={async (values) => {
          if (!editingEvent) return;
          await onUpdateEvent(
            {
              eventOrganization: editingEvent.eventOrganization,
              eventName: editingEvent.eventName,
              majorStage: editingEvent.majorStage,
            },
            values
          );
          setEditingEvent(null);
        }}
      />
    </EventStatsRoot>
  );
};

export default EventStats;
