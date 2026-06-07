import { useMemo, useState } from "react";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import BetsHistoryMobileList from "./BetsHistoryMobileList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Bet } from "@/entities/bet";
import BetDescriptionCell from "@/features/bets/components/BetDescriptionCell/BetDescriptionCell";
import ActionButtons from "@/features/bets/components/ActionButtons/ActionButtons";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import { eventKeyFromBet, formatEventLabel } from "@/features/events/lib/eventDisplay";
import {
  sortBetsByDateTime,
  type BetDateTimeSortDirection,
} from "@/features/bets/lib/sortBets";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  AmountValue,
  BetsHistoryStyled,
  CellContent,
  CellLogoWrap,
  DateStack,
  EmptyState,
  FiltersHeader,
  FiltersPanel,
  FiltersTitle,
  FilterOptionRow,
  FiltersWrapper,
  FormatBadge,
  HistoryCard,
  filterSelectMenuProps,
  OddsValue,
  PayoutValue,
  StatusBadge,
  TableScroll,
  filterControlSx,
} from "./BetsHistory.styled";

interface BetsHistoryProps {
  bets: Bet[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

type StatusFilter = "все" | Bet["status"];
type CellAlign = "left" | "center" | "right";

const wrapTextSx = {
  wordBreak: "break-word",
  overflowWrap: "anywhere",
} as const;

const columns = {
  date: { label: "Дата", minWidth: 104, align: "left" as CellAlign, wrap: false },
  event: { label: "Турнир", minWidth: 200, align: "left" as CellAlign, wrap: true },
  team1: { label: "Команда 1", minWidth: 172, align: "left" as CellAlign, wrap: true },
  team2: { label: "Команда 2", minWidth: 172, align: "left" as CellAlign, wrap: true },
  betType: { label: "Ставка", minWidth: 168, align: "left" as CellAlign, wrap: true },
  amount: { label: "Сумма", minWidth: 88, align: "right" as CellAlign, wrap: false },
  odds: { label: "Коэф.", minWidth: 64, align: "right" as CellAlign, wrap: false },
  payout: { label: "Выплата", minWidth: 100, align: "right" as CellAlign, wrap: false },
  status: { label: "Статус", minWidth: 118, align: "center" as CellAlign, wrap: false },
  actions: { label: "Действия", minWidth: 128, align: "center" as CellAlign, wrap: false },
} as const;

const cellSx = (
  key: keyof typeof columns,
  head = false
): SxProps<Theme> => {
  const col = columns[key];
  return {
    minWidth: col.minWidth,
    textAlign: col.align,
    verticalAlign: "middle",
    py: head ? 1.5 : 1.75,
    px: 1.75,
    whiteSpace: col.wrap ? "normal" : "nowrap",
    fontWeight: head ? 600 : 400,
    ...(col.wrap ? wrapTextSx : {}),
  };
};

const EventFilterOption = ({
  eventOrganization,
  eventName,
}: {
  eventOrganization: string;
  eventName: string;
}) => (
  <FilterOptionRow>
    <OrganizationLogo name={eventOrganization} size={27} />
    <Box minWidth={0} flex={1}>
      <Typography variant="body2" noWrap title={eventOrganization} lineHeight={1.3}>
        {eventOrganization}
      </Typography>
      {eventName ? (
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          title={eventName}
          display="block"
          lineHeight={1.2}
        >
          {eventName}
        </Typography>
      ) : null}
    </Box>
  </FilterOptionRow>
);

const formatPayout = (bet: Bet) => {
  if (bet.status === "WAIT") {
    return `до ${(bet.amount * bet.odds).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
};

const BetsHistory = ({ bets, onEdit, onDelete, onWin, onLose, onRevert }: BetsHistoryProps) => {
  const isMobile = useIsMobile();
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("все");
  const [filterEvent, setFilterEvent] = useState("");
  const [filterOrganization, setFilterOrganization] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortDir, setSortDir] = useState<BetDateTimeSortDirection>("desc");

  const eventOptions = useMemo(() => {
    const map = new Map<string, { eventOrganization: string; eventName: string }>();
    for (const bet of bets) {
      const key = eventKeyFromBet(bet);
      if (!map.has(key)) {
        map.set(key, {
          eventOrganization: bet.eventOrganization,
          eventName: bet.eventName,
        });
      }
    }
    return Array.from(map.entries()).sort((a, b) =>
      formatEventLabel(a[1].eventOrganization, a[1].eventName).localeCompare(
        formatEventLabel(b[1].eventOrganization, b[1].eventName),
        "ru"
      )
    );
  }, [bets]);

  const selectedEvent = eventOptions.find(([key]) => key === filterEvent)?.[1];
  const uniqueOrganizations = Array.from(
    new Set(bets.flatMap((b) => [b.organization1, b.organization2]))
  ).sort();
  const uniqueDates = useMemo(
    () => Array.from(new Set(bets.map((b) => b.date))).sort((a, b) => b.localeCompare(a)),
    [bets]
  );

  const filteredBets = useMemo(
    () =>
      sortBetsByDateTime(
        bets
          .filter((b) => filterStatus === "все" || b.status === filterStatus)
          .filter((b) => !filterEvent || eventKeyFromBet(b) === filterEvent)
          .filter(
            (b) =>
              !filterOrganization ||
              b.organization1 === filterOrganization ||
              b.organization2 === filterOrganization
          )
          .filter((b) => !filterDate || b.date === filterDate),
        sortDir
      ),
    [bets, filterStatus, filterEvent, filterOrganization, filterDate, sortDir]
  );

  const hasActiveFilters =
    filterStatus !== "все" || filterEvent || filterOrganization || filterDate;

  return (
    <BetsHistoryStyled>
      <HistoryCard>
        <FiltersPanel>
          <FiltersHeader>
            <FiltersTitle>История</FiltersTitle>
            <Chip
              label={
                hasActiveFilters
                  ? `${filteredBets.length} / ${bets.length}`
                  : `${bets.length}`
              }
              size="small"
              variant="outlined"
              sx={{ borderColor: "rgba(76, 175, 80, 0.35)" }}
            />
          </FiltersHeader>

          <FiltersWrapper>
            <FormControl size="small" sx={filterControlSx}>
              <InputLabel id="history-filter-status-label" shrink>
                Статус
              </InputLabel>
              <Select
                labelId="history-filter-status-label"
                id="history-filter-status"
                value={filterStatus}
                label="Статус"
                onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
              >
                <MenuItem value="все">Все</MenuItem>
                <MenuItem value="WAIT">WAIT</MenuItem>
                <MenuItem value="WIN">WIN</MenuItem>
                <MenuItem value="LOSE">LOSE</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ ...filterControlSx, flex: { xs: "1 1 100%", sm: "1 1 200px" } }}
            >
              <InputLabel id="history-filter-event-label" shrink>
                Турнир
              </InputLabel>
              <Select
                labelId="history-filter-event-label"
                id="history-filter-event"
                value={filterEvent}
                label="Турнир"
                displayEmpty
                onChange={(e) => setFilterEvent(e.target.value)}
                MenuProps={filterSelectMenuProps}
                renderValue={(value) => {
                  if (!value) return "Все";
                  if (!selectedEvent) return value;
                  return (
                    <FilterOptionRow>
                      <OrganizationLogo name={selectedEvent.eventOrganization} size={25} />
                      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                        {formatEventLabel(
                          selectedEvent.eventOrganization,
                          selectedEvent.eventName
                        )}
                      </Typography>
                    </FilterOptionRow>
                  );
                }}
              >
                <MenuItem value="">Все</MenuItem>
                {eventOptions.map(([key, event]) => (
                  <MenuItem key={key} value={key} sx={{ py: 0.75 }}>
                    <EventFilterOption
                      eventOrganization={event.eventOrganization}
                      eventName={event.eventName}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={filterControlSx}>
              <InputLabel id="history-filter-team-label" shrink>
                Команда
              </InputLabel>
              <Select
                labelId="history-filter-team-label"
                id="history-filter-team"
                value={filterOrganization}
                label="Команда"
                displayEmpty
                onChange={(e) => setFilterOrganization(e.target.value)}
                MenuProps={filterSelectMenuProps}
                renderValue={(value) => {
                  if (!value) return "Все";
                  return (
                    <FilterOptionRow>
                      <TeamLogo name={value} size={25} />
                      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                        {value}
                      </Typography>
                    </FilterOptionRow>
                  );
                }}
              >
                <MenuItem value="">Все</MenuItem>
                {uniqueOrganizations.map((org) => (
                  <MenuItem key={org} value={org} sx={{ py: 0.5 }}>
                    <TeamLogo name={org} size={27} showName />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={filterControlSx}>
              <InputLabel id="history-filter-day-label" shrink>
                День
              </InputLabel>
              <Select
                labelId="history-filter-day-label"
                id="history-filter-day"
                value={filterDate}
                label="День"
                displayEmpty
                renderValue={(value) => (value ? formatIsoDateDots(value) : "Все")}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <MenuItem value="">Все</MenuItem>
                {uniqueDates.map((date) => (
                  <MenuItem key={date} value={date}>
                    {formatIsoDateDots(date)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                ...filterControlSx,
                minWidth: { xs: 0, sm: 168 },
                flex: { xs: "1 1 100%", sm: "1 1 168px" },
              }}
            >
              <InputLabel id="history-sort-label" shrink>
                Дата
              </InputLabel>
              <Select
                labelId="history-sort-label"
                id="history-sort"
                value={sortDir}
                label="Дата"
                onChange={(e) => setSortDir(e.target.value as BetDateTimeSortDirection)}
              >
                <MenuItem value="desc">Сначала новые</MenuItem>
                <MenuItem value="asc">Сначала старые</MenuItem>
              </Select>
            </FormControl>
          </FiltersWrapper>
        </FiltersPanel>

        {filteredBets.length === 0 ? (
          <EmptyState>
            {bets.length === 0
              ? "Ставок пока нет — добавьте первую"
              : "Нет ставок по выбранным фильтрам"}
          </EmptyState>
        ) : isMobile ? (
          <BetsHistoryMobileList
            bets={filteredBets}
            onEdit={onEdit}
            onDelete={onDelete}
            onWin={onWin}
            onLose={onLose}
            onRevert={onRevert}
          />
        ) : (
          <TableScroll>
            <Table
              size="small"
              sx={{
                tableLayout: "auto",
                width: "max-content",
                minWidth: "100%",
              }}
            >
              <TableHead>
                <TableRow>
                  {(Object.keys(columns) as (keyof typeof columns)[]).map((key) => (
                    <TableCell key={key} sx={cellSx(key, true)}>
                      {columns[key].label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBets.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell sx={cellSx("date")}>
                      <CellContent>
                        <DateStack>
                          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                            {formatIsoDateDots(bet.date)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {bet.time}
                          </Typography>
                          <FormatBadge>{bet.format}</FormatBadge>
                        </DateStack>
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("event")}>
                      <CellContent>
                        <Box display="flex" alignItems="center" gap={1.25} minWidth={0}>
                          <CellLogoWrap>
                            <OrganizationLogo name={bet.eventOrganization} size={29} />
                          </CellLogoWrap>
                          <Box minWidth={0} flex={1}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              lineHeight={1.3}
                              title={bet.eventOrganization}
                              sx={wrapTextSx}
                            >
                              {bet.eventOrganization}
                            </Typography>
                            {bet.eventName && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                title={bet.eventName}
                                sx={{ mt: 0.25, ...wrapTextSx }}
                              >
                                {bet.eventName}
                              </Typography>
                            )}
                            {bet.eventTier === "Major" && bet.majorStage ? (
                              <Box sx={{ mt: 0.5 }}>
                                <MajorStageBadge stage={bet.majorStage} />
                              </Box>
                            ) : null}
                          </Box>
                        </Box>
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("team1")}>
                      <CellContent>
                        <TeamLogo name={bet.organization1} size={33} showName nameWrap />
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("team2")}>
                      <CellContent>
                        <TeamLogo name={bet.organization2} size={33} showName nameWrap />
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("betType")}>
                      <CellContent>
                        <BetDescriptionCell bet={bet} />
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("amount")}>
                      <CellContent $align="right">
                        <AmountValue>
                          {bet.amount.toLocaleString("ru-RU")} ₽
                        </AmountValue>
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("odds")}>
                      <CellContent $align="right">
                        <OddsValue>{bet.odds.toFixed(2)}</OddsValue>
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("payout")}>
                      <CellContent $align="right">
                        <PayoutValue $status={bet.status}>{formatPayout(bet)}</PayoutValue>
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("status")}>
                      <CellContent $align="center">
                        <StatusBadge $status={bet.status}>{bet.status}</StatusBadge>
                      </CellContent>
                    </TableCell>
                    <TableCell sx={cellSx("actions")}>
                      <CellContent $align="center">
                        <ActionButtons
                          bet={bet}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onWin={onWin}
                          onLose={onLose}
                          onRevert={onRevert}
                        />
                      </CellContent>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScroll>
        )}
      </HistoryCard>
    </BetsHistoryStyled>
  );
};

export default BetsHistory;
