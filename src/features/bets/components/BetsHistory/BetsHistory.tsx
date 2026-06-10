import { useMemo, useState } from "react";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import BetsHistoryMobileList from "./BetsHistoryMobileList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Bet } from "@/entities/bet";
import BetDescriptionCell from "@/features/bets/components/BetDescriptionCell/BetDescriptionCell";
import ActionButtons from "@/features/bets/components/ActionButtons/ActionButtons";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import type { EventRecord } from "@/entities/eventRecord";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import { sortBetsByDateTime } from "@/features/bets/lib/sortBets";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  AmountValue,
  BetsHistoryStyled,
  CellContent,
  CellLogoWrap,
  DateStack,
  EmptyState,
  FiltersPanel,
  FiltersWrapper,
  FormatBadge,
  HistoryCard,
  OddsValue,
  PayoutValue,
  StatusBadge,
  TableScroll,
} from "./BetsHistory.styled";

interface BetsHistoryProps {
  bets: Bet[];
  events?: EventRecord[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

type CellAlign = "left" | "center" | "right";

const matchesBetSearch = (bet: Bet, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    bet.date,
    bet.time,
    bet.eventOrganization,
    bet.eventName,
    bet.organization1,
    bet.organization2,
    bet.betType,
    bet.status,
    bet.format,
    bet.majorStage,
    String(bet.amount),
    String(bet.odds),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
};

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

const formatPayout = (bet: Bet) => {
  if (bet.status === "WAIT") {
    return `до ${(bet.amount * bet.odds).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
};

const BetsHistory = ({
  bets,
  events = [],
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
}: BetsHistoryProps) => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");

  const filteredBets = useMemo(
    () =>
      sortBetsByDateTime(
        bets.filter((bet) => matchesBetSearch(bet, search)),
        "desc"
      ),
    [bets, search]
  );

  return (
    <BetsHistoryStyled>
      <HistoryCard>
        <FiltersPanel>
          <FiltersWrapper>
            <TextField
              size="small"
              fullWidth
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(limitInputLength(e.target.value))}
              slotProps={{
                htmlInput: { maxLength: MAX_INPUT_LENGTH },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ flex: "1 1 100%" }}
            />
          </FiltersWrapper>
        </FiltersPanel>

        {filteredBets.length === 0 ? (
          <EmptyState>
            {bets.length === 0
              ? "Ставок пока нет — добавьте первую"
              : "Ничего не найдено"}
          </EmptyState>
        ) : isMobile ? (
          <BetsHistoryMobileList
            bets={filteredBets}
            events={events}
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
                            <EventLogo
                              logoSlug={resolveEventLogoSlug(
                                bet.eventOrganization,
                                bet.eventName,
                                events
                              )}
                              label={bet.eventName || bet.eventOrganization}
                              size={29}
                            />
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
                            {bet.majorStage ? (
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
