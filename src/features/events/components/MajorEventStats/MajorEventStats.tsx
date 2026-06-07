import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity, EventStats as EventStatsItem } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import { MAJOR_STAGES, type MajorStage } from "@/entities/event";
import EventFormDialog from "@/features/events/components/EventFormDialog/EventFormDialog";
import { formatEventLabel } from "@/features/events/lib/eventDisplay";
import {
  calcMajorEventGroups,
  majorEventGroupKey,
  majorGroupToEventStats,
  sortMajorEventGroupsByDate,
} from "@/features/events/lib/majorEventStats";
import type { SortDirection } from "@/features/events/lib/eventStatsSort";
import {
  EmptySearch,
  EventGrid,
  EventScrollArea,
  EventStatsRoot,
  EventStatsToolbar,
  filterControlSx,
} from "@/features/events/components/EventStats/EventStats.styled";
import MajorEventGroupCard from "./MajorEventGroupCard";

interface MajorEventStatsProps {
  isAdmin?: boolean;
  bets: Bet[];
  events?: EventRecord[];
  emptyMessage?: string;
  notFoundMessage?: string;
  onUpdateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
}

const MajorEventStats = ({
  isAdmin = false,
  bets,
  events = [],
  emptyMessage = "Нет major турниров — назначьте статус Major при создании или редактировании турнира",
  notFoundMessage = "Нет major турниров по выбранным фильтрам",
  onUpdateEvent,
}: MajorEventStatsProps) => {
  const [editingEvent, setEditingEvent] = useState<EventStatsItem | null>(null);
  const [editingAllMajorStages, setEditingAllMajorStages] = useState(false);
  const [search, setSearch] = useState("");
  const [filterOrganization, setFilterOrganization] = useState("");
  const [filterMajorStage, setFilterMajorStage] = useState<MajorStage | "">("");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const groups = useMemo(() => calcMajorEventGroups(bets, events), [bets, events]);

  const organizations = useMemo(
    () =>
      Array.from(new Set(groups.map((item) => item.eventOrganization))).sort((a, b) =>
        a.localeCompare(b, "ru")
      ),
    [groups]
  );

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = groups
      .filter((item) => !filterOrganization || item.eventOrganization === filterOrganization)
      .filter((item) => {
        if (!filterMajorStage) return true;
        return item.stages.some((stage) => stage.majorStage === filterMajorStage);
      })
      .filter(
        (item) =>
          !q ||
          item.eventName.toLowerCase().includes(q) ||
          formatEventLabel(item.eventOrganization, item.eventName, {
            eventTier: "Major",
          })
            .toLowerCase()
            .includes(q)
      );

    return sortMajorEventGroupsByDate(filtered, sortDir);
  }, [groups, search, filterOrganization, filterMajorStage, sortDir]);

  const hasActiveFilters = Boolean(search.trim() || filterOrganization || filterMajorStage);

  if (groups.length === 0) {
    return (
      <EventStatsRoot>
        <EmptySearch>{emptyMessage}</EmptySearch>
      </EventStatsRoot>
    );
  }

  return (
    <EventStatsRoot>
      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
        <Chip
          label={hasActiveFilters ? `${displayed.length} / ${groups.length}` : groups.length}
          size="small"
          variant="outlined"
          sx={{ borderColor: "rgba(76, 175, 80, 0.35)" }}
        />
      </Box>

      <TextField
        size="small"
        fullWidth
        placeholder="Поиск названия major..."
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
          <InputLabel>Дата</InputLabel>
          <Select
            value={sortDir}
            label="Дата"
            onChange={(e) => setSortDir(e.target.value as SortDirection)}
          >
            <MenuItem value="desc">Сначала новые</MenuItem>
            <MenuItem value="asc">Сначала старые</MenuItem>
          </Select>
        </FormControl>
      </EventStatsToolbar>

      <EventScrollArea>
        {displayed.length === 0 ? (
          <EmptySearch>{notFoundMessage}</EmptySearch>
        ) : (
          <EventGrid>
            {displayed.map((group) => {
              const stages = filterMajorStage
                ? group.stages.filter((stage) => stage.majorStage === filterMajorStage)
                : group.stages;

              return (
                <MajorEventGroupCard
                  key={majorEventGroupKey(group.eventOrganization, group.eventName)}
                  group={group}
                  stages={stages}
                  showEdit={isAdmin}
                  onEditGroup={() => {
                    setEditingAllMajorStages(true);
                    setEditingEvent(majorGroupToEventStats(group));
                  }}
                  onEditStage={(stage) => {
                    setEditingAllMajorStages(false);
                    setEditingEvent(stage);
                  }}
                />
              );
            })}
          </EventGrid>
        )}
      </EventScrollArea>

      <EventFormDialog
        open={Boolean(editingEvent)}
        bets={bets}
        initial={editingEvent ?? undefined}
        editEventDates={editingAllMajorStages || !editingEvent?.majorStage}
        onClose={() => {
          setEditingEvent(null);
          setEditingAllMajorStages(false);
        }}
        onSubmit={async (values) => {
          if (!editingEvent) return;
          await onUpdateEvent(
            {
              eventOrganization: editingEvent.eventOrganization,
              eventName: editingEvent.eventName,
              majorStage: editingAllMajorStages ? undefined : editingEvent.majorStage,
              allMajorStages: editingAllMajorStages,
            },
            values
          );
          setEditingEvent(null);
          setEditingAllMajorStages(false);
        }}
      />
    </EventStatsRoot>
  );
};

export default MajorEventStats;
