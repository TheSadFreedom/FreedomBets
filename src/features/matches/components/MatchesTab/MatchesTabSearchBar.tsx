import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { buildSportsRuSyncRequest } from "@/features/sportsru/lib/sportsRuSyncOptions";
import {
  MATCH_STATUS_FILTER_OPTIONS,
  type MatchStatusFilter,
} from "@/features/matches/lib/filterMatchesByStatus";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import {
  FiltersPanel,
  FiltersWrapper,
  MatchSyncButton,
  SearchFieldWrap,
  SearchRow,
  StatusFilterChip,
  StatusFilterRow,
} from "./MatchesTab.styled";

interface MatchesTabSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: MatchStatusFilter;
  onStatusFilterChange: (value: MatchStatusFilter) => void;
  onSyncSportsRu?: (options: { dates: string[] }) => Promise<void>;
}

const MatchesTabSearchBar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onSyncSportsRu,
}: MatchesTabSearchBarProps) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!onSyncSportsRu || syncing) return;

    setSyncing(true);
    try {
      await onSyncSportsRu(buildSportsRuSyncRequest("nearbyDays"));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <FiltersPanel>
      <FiltersWrapper>
        <SearchRow>
          <SearchFieldWrap>
            <TextField
              size="small"
              fullWidth
              placeholder="Поиск по турниру или команде"
              value={search}
              onChange={(e) => onSearchChange(limitInputLength(e.target.value))}
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
          </SearchFieldWrap>

          {onSyncSportsRu ? (
            <MatchSyncButton
              type="button"
              $syncing={syncing}
              disabled={syncing}
              onClick={() => void handleSync()}
              aria-label="Обновить матчи с Sports.ru"
              title="Sports.ru: вчера, сегодня, завтра"
            >
              <RefreshOutlinedIcon />
            </MatchSyncButton>
          ) : null}
        </SearchRow>

        <StatusFilterRow aria-label="Фильтр по статусу матча" role="group">
          {MATCH_STATUS_FILTER_OPTIONS.map(({ value, label }) => (
            <StatusFilterChip
              key={value}
              type="button"
              $active={statusFilter === value}
              aria-pressed={statusFilter === value}
              aria-label={label}
              onClick={() => onStatusFilterChange(value)}
            >
              {label}
            </StatusFilterChip>
          ))}
        </StatusFilterRow>
      </FiltersWrapper>
    </FiltersPanel>
  );
};

export default MatchesTabSearchBar;
