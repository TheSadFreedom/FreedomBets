import { useMemo, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import type { Bet } from "@/entities/bet";
import type { RankingBaseline } from "@/entities/ranking";
import type { Team, TeamEditInput } from "@/entities/team";
import TeamFormDialog from "@/features/teams/components/TeamFormDialog/TeamFormDialog";
import { filterCanonicalTeams } from "@/features/teams/lib/filterCanonicalTeams";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import { getTeamMatchKey, getTeamSearchTerms, resolveTeamSynonyms } from "@/shared/lib/teams/teamNames";
import { matchesSearchQuery } from "@/shared/lib/search/textSearch";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import type { RankTone } from "./TeamsTab.styled";
import {
  BetsCount,
  BetsLabel,
  EditTeamButton,
  EmptyState,
  FiltersRow,
  HeroBadge,
  HeroCard,
  HeroContent,
  HeroGlow,
  HeroHint,
  HeroIcon,
  HeroLeft,
  HeroText,
  HeroTitle,
  ListSection,
  LogoRing,
  RankNumber,
  RefreshButton,
  RowInfo,
  RowLeft,
  RowRight,
  RowStats,
  SearchFieldWrap,
  ShareFill,
  ShareTrack,
  TabRoot,
  TeamName,
  TeamRow,
  TeamsCard,
  Toolbar,
} from "./TeamsTab.styled";

interface TeamsTabProps {
  allBets: Bet[];
  teams: Team[];
  rankingBaseline: RankingBaseline | null;
  onRefreshRankingBaseline: (force?: boolean) => Promise<RankingBaseline | null>;
  onUpdateTeam: (teamId: string, data: TeamEditInput) => Promise<void>;
}

interface TeamRowItem {
  team: Team;
  rank: number;
}

const rankTone = (rank: number, hasPoints: boolean): RankTone | undefined => {
  if (!hasPoints) return undefined;
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return undefined;
};

const formatTeamsCount = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} команда`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} команды`;
  return `${count} команд`;
};

const buildTeamRows = (teams: Team[]): TeamRowItem[] => {
  const sorted = filterCanonicalTeams(teams).sort((left, right) => {
      const pointsDiff = (right.vrsPoints ?? 0) - (left.vrsPoints ?? 0);
      if (pointsDiff !== 0) return pointsDiff;
      return left.name.localeCompare(right.name, "ru");
    });

  return sorted.map((team, index) => ({
    team: {
      ...team,
      synonyms: resolveTeamSynonyms(team),
    },
    rank: index + 1,
  }));
};

const TeamsTab = ({
  allBets,
  teams,
  rankingBaseline,
  onRefreshRankingBaseline,
  onUpdateTeam,
}: TeamsTabProps) => {
  const [search, setSearch] = useState("");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const teamRows = useMemo(() => buildTeamRows(teams), [teams]);

  const betsByTeamKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const bet of allBets) {
      for (const side of [
        { id: bet.team1Id, name: bet.organization1 },
        { id: bet.team2Id, name: bet.organization2 },
      ]) {
        const key = side.id?.trim() || getTeamMatchKey(side.name);
        if (!key) continue;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
    return map;
  }, [allBets]);

  const hasPoints = teamRows.some((item) => item.team.vrsPoints > 0);
  const topPoints = teamRows[0]?.team.vrsPoints ?? 1;

  const displayed = useMemo(() => {
    if (!search.trim()) return teamRows;
    return teamRows.filter(({ team }) =>
      matchesSearchQuery(
        [team.name, ...getTeamSearchTerms(team.name), ...team.synonyms],
        search
      )
    );
  }, [teamRows, search]);

  const handleRefreshBaseline = async () => {
    setRefreshing(true);
    try {
      await onRefreshRankingBaseline(true);
    } finally {
      setRefreshing(false);
    }
  };

  const snapshotLabel = rankingBaseline?.snapshotDate
    ? `Valve VRS · снимок от ${rankingBaseline.snapshotDate}`
    : "Valve VRS · обновите рейтинг";

  if (teamRows.length === 0) {
    return (
      <TabRoot>
        <EmptyState>Нет команд в базе</EmptyState>
      </TabRoot>
    );
  }

  return (
    <TabRoot>
      <HeroCard>
        <HeroGlow aria-hidden />
        <HeroContent>
          <HeroLeft>
            <HeroIcon aria-hidden>
              <GroupsOutlinedIcon sx={{ fontSize: 22 }} />
            </HeroIcon>
            <HeroText>
              <HeroTitle>Команды</HeroTitle>
              <HeroHint>{snapshotLabel}</HeroHint>
            </HeroText>
          </HeroLeft>
          <HeroBadge>{formatTeamsCount(teamRows.length)}</HeroBadge>
        </HeroContent>
      </HeroCard>

      <TeamsCard>
        <Toolbar>
          <FiltersRow>
            <SearchFieldWrap>
              <TextField
                size="small"
                fullWidth
                placeholder="Поиск команды"
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
            </SearchFieldWrap>
            <Tooltip title="Обновить рейтинг Valve с GitHub">
              <RefreshButton
                type="button"
                onClick={() => void handleRefreshBaseline()}
                disabled={refreshing}
                aria-label="Обновить рейтинг Valve"
              >
                <RefreshIcon />
              </RefreshButton>
            </Tooltip>
          </FiltersRow>
        </Toolbar>

        {displayed.length === 0 ? (
          <EmptyState>Ничего не найдено</EmptyState>
        ) : (
          <ListSection>
            {displayed.map(({ team, rank }) => {
              const tone = rankTone(rank, hasPoints);
              const share = hasPoints ? team.vrsPoints / topPoints : 0;
              const betCount = betsByTeamKey.get(team.id) ?? 0;

              return (
                <TeamRow key={team.id} $tone={tone}>
                  <RowLeft>
                    <RankNumber $tone={tone}>{rank}</RankNumber>
                    <LogoRing>
                      <TeamLogo name={team.name} size={36} />
                    </LogoRing>
                    <RowInfo>
                      <TeamName>{team.name}</TeamName>
                      {betCount > 0 ? (
                        <RowStats>{betCount} ставок</RowStats>
                      ) : null}
                      {hasPoints ? (
                        <ShareTrack>
                          <ShareFill $share={share} $tone={tone} />
                        </ShareTrack>
                      ) : null}
                    </RowInfo>
                  </RowLeft>
                  <RowRight>
                    {hasPoints ? (
                      <>
                        <BetsLabel>Очки</BetsLabel>
                        <BetsCount>{team.vrsPoints.toLocaleString("ru-RU")}</BetsCount>
                      </>
                    ) : null}
                  </RowRight>
                  <Tooltip title="Редактировать команду">
                    <EditTeamButton
                      type="button"
                      aria-label={`Редактировать ${team.name}`}
                      onClick={() => setEditingTeam(team)}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </EditTeamButton>
                  </Tooltip>
                </TeamRow>
              );
            })}
          </ListSection>
        )}
      </TeamsCard>

      <TeamFormDialog
        open={editingTeam !== null}
        team={editingTeam}
        onClose={() => setEditingTeam(null)}
        onSubmit={onUpdateTeam}
      />
    </TabRoot>
  );
};

export default TeamsTab;
