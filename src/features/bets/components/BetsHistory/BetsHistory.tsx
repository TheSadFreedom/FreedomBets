import { useMemo, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { sortBetsByDateTime } from "@/features/bets/lib/sortBets";
import { matchesBetSearch } from "@/features/bets/lib/matchesBetSearch";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import BetHistoryCard from "./BetHistoryCard";
import {
  BetList,
  BetsHistoryStyled,
  EmptyState,
  FiltersActions,
  FiltersHeader,
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

  const hasActiveSearch = Boolean(search.trim());

  return (
    <BetsHistoryStyled>
      <HistoryCard>
        <FiltersPanel>
          {hasActiveSearch ? (
            <FiltersHeader>
              <FiltersActions>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setSearch("")}
                  sx={{ minWidth: 0 }}
                >
                  Сбросить
                </Button>
              </FiltersActions>
            </FiltersHeader>
          ) : null}

          <FiltersWrapper>
            <TextField
              size="small"
              fullWidth
              placeholder="Поиск по турниру, команде или виду ставки"
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
                  backgroundColor: "#2e2e2e",
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
