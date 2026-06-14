import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import {
  FiltersActions,
  FiltersHeader,
  FiltersPanel,
  FiltersWrapper,
} from "./EventStats.styled";

interface EventStatsFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const EventStatsFiltersBar = ({
  search,
  onSearchChange,
  hasActiveFilters,
  onResetFilters,
}: EventStatsFiltersBarProps) => (
  <FiltersPanel>
    {hasActiveFilters ? (
      <FiltersHeader>
        <FiltersActions>
          <Button size="small" variant="text" onClick={onResetFilters} sx={{ minWidth: 0 }}>
            Сбросить
          </Button>
        </FiltersActions>
      </FiltersHeader>
    ) : null}

    <FiltersWrapper>
      <TextField
        size="small"
        fullWidth
        placeholder="Поиск"
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
          flex: "1 1 100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2e2e2e",
            borderRadius: "10px",
          },
        }}
      />
    </FiltersWrapper>
  </FiltersPanel>
);

export default EventStatsFiltersBar;
