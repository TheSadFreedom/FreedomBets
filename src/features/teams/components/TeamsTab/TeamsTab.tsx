import { useMemo, useState } from "react";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import {
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { Bet } from "@/entities/bet";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { calcTeamStatsList } from "@/features/teams/lib/calcTeamStatsList";
import {
  BetsCount,
  CellContent,
  EmptyState,
  FiltersRow,
  MobileTeamCard,
  MobileTeamCount,
  MobileTeamLeft,
  MobileTeamList,
  TabRoot,
  TableScroll,
  TeamCell,
  TeamName,
  TeamsCard,
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
  filterControlSx,
} from "./TeamsTab.styled";

type SortField = "name" | "totalBets";
type SortDirection = "asc" | "desc";

interface TeamsTabProps {
  allBets: Bet[];
}

const cellSx = {
  verticalAlign: "middle",
  py: 1.75,
  px: 1.75,
} as const;

const headCellSx = {
  ...cellSx,
  fontWeight: 600,
} as const;

const TeamsTab = ({ allBets }: TeamsTabProps) => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("totalBets");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const stats = useMemo(() => calcTeamStatsList(allBets), [allBets]);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? stats.filter((item) => item.name.toLowerCase().includes(q))
      : stats;

    const mult = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "ru") * mult;
      }
      const cmp = a.totalBets - b.totalBets;
      if (cmp !== 0) return cmp * mult;
      return a.name.localeCompare(b.name, "ru");
    });
  }, [stats, search, sortBy, sortDir]);

  const hasActiveFilters = Boolean(search.trim());

  if (stats.length === 0) {
    return (
      <TabRoot>
        <TeamsCard>
          <EmptyState>Нет команд — добавьте ставки с указанием команд</EmptyState>
        </TeamsCard>
      </TabRoot>
    );
  }

  return (
    <TabRoot>
      <TeamsCard>
        <Toolbar>
          <ToolbarHeader>
            <ToolbarTitle>Команды</ToolbarTitle>
            <Chip
              label={
                hasActiveFilters
                  ? `${displayed.length} / ${stats.length}`
                  : `${stats.length} · ${allBets.length} ставок`
              }
              size="small"
              variant="outlined"
              sx={{ borderColor: "rgba(76, 175, 80, 0.35)" }}
            />
          </ToolbarHeader>

          <FiltersRow>
            <TextField
              size="small"
              fullWidth
              placeholder="Поиск команды..."
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
              sx={{ flex: { xs: "1 1 100%", sm: "1 1 240px" } }}
            />

            <FormControl size="small" sx={filterControlSx}>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={sortBy}
                label="Сортировка"
                onChange={(e) => setSortBy(e.target.value as SortField)}
              >
                <MenuItem value="totalBets">Количество ставок</MenuItem>
                <MenuItem value="name">Название</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={filterControlSx}>
              <InputLabel>Порядок</InputLabel>
              <Select
                value={sortDir}
                label="Порядок"
                onChange={(e) => setSortDir(e.target.value as SortDirection)}
              >
                <MenuItem value="desc">По убыванию</MenuItem>
                <MenuItem value="asc">По возрастанию</MenuItem>
              </Select>
            </FormControl>
          </FiltersRow>
        </Toolbar>

        {displayed.length === 0 ? (
          <EmptyState>Ничего не найдено</EmptyState>
        ) : isMobile ? (
          <MobileTeamList>
            {displayed.map((item) => (
              <MobileTeamCard key={item.name}>
                <MobileTeamLeft>
                  <TeamLogo name={item.name} size={36} />
                  <TeamName>{item.name}</TeamName>
                </MobileTeamLeft>
                <MobileTeamCount>{item.totalBets}</MobileTeamCount>
              </MobileTeamCard>
            ))}
          </MobileTeamList>
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
                  <TableCell sx={{ ...headCellSx, minWidth: 280 }}>Команда</TableCell>
                  <TableCell sx={{ ...headCellSx, minWidth: 120, textAlign: "right" }}>
                    Ставок
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayed.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell sx={cellSx}>
                      <CellContent>
                        <TeamCell>
                          <TeamLogo name={item.name} size={33} />
                          <TeamName>{item.name}</TeamName>
                        </TeamCell>
                      </CellContent>
                    </TableCell>
                    <TableCell sx={{ ...cellSx, textAlign: "right" }}>
                      <CellContent $align="right">
                        <BetsCount>{item.totalBets}</BetsCount>
                      </CellContent>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScroll>
        )}
      </TeamsCard>
    </TabRoot>
  );
};

export default TeamsTab;
