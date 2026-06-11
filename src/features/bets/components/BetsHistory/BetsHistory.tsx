import { useMemo, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { sortBetsByDateTime } from "@/features/bets/lib/sortBets";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import BetHistoryCard from "./BetHistoryCard";
import {
  BetList,
  BetsHistoryStyled,
  EmptyState,
  FiltersPanel,
  FiltersWrapper,
  HistoryCard,
} from "./BetsHistory.styled";

interface BetsHistoryProps {
  bets: Bet[];
  matches?: Match[];
  events?: EventRecord[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

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

const BetsHistory = ({
  bets,
  matches = [],
  events = [],
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
}: BetsHistoryProps) => {
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "10px",
                },
              }}
            />
          </FiltersWrapper>
        </FiltersPanel>

        {filteredBets.length === 0 ? (
          <EmptyState>
            {bets.length === 0
              ? "Ставок пока нет — добавьте первую"
              : "Ничего не найдено"}
          </EmptyState>
        ) : (
          <BetList>
            {filteredBets.map((bet) => (
              <BetHistoryCard
                key={bet.id}
                bet={bet}
                matches={matches}
                events={events}
                onEdit={onEdit}
                onDelete={onDelete}
                onWin={onWin}
                onLose={onLose}
                onRevert={onRevert}
              />
            ))}
          </BetList>
        )}
      </HistoryCard>
    </BetsHistoryStyled>
  );
};

export default BetsHistory;
