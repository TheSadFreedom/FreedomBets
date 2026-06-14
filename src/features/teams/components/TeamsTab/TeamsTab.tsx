import { useMemo, useState } from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import type { Bet } from "@/entities/bet";
import type { RankingBaseline } from "@/entities/ranking";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import { getTeamMatchKey } from "@/shared/lib/teams/teamNames";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import type { RankTone } from "./TeamsTab.styled";
import {
  BetsCount,
  BetsLabel,
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
  rankingBaseline: RankingBaseline | null;
  onRefreshRankingBaseline: (force?: boolean) => Promise<RankingBaseline | null>;
}

const rankTone = (rank: number): RankTone | undefined => {
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

const TeamsTab = ({
  allBets,
  rankingBaseline,
  onRefreshRankingBaseline,
}: TeamsTabProps) => {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const rankings = useMemo(() => {
    const teams = rankingBaseline?.teams ?? [];
    return [...teams].sort((a, b) => a.globalRank - b.globalRank);
  }, [rankingBaseline]);

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

  const topPoints = rankings[0]?.points ?? 1;

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rankings;
    return rankings.filter((item) => item.teamName.toLowerCase().includes(q));
  }, [rankings, search]);

  const handleRefreshBaseline = async () => {
    setRefreshing(true);
    try {
      await onRefreshRankingBaseline(true);
    } finally {
      setRefreshing(false);
    }
  };

  if (rankings.length === 0) {
    return (
      <TabRoot>
        <EmptyState>
          {rankingBaseline
            ? "Нет команд в рейтинге Valve"
            : "Загрузка рейтинга Valve…"}
        </EmptyState>
      </TabRoot>
    );
  }

  const snapshotLabel = rankingBaseline?.snapshotDate
    ? `снимок от ${rankingBaseline.snapshotDate}`
    : "без даты снимка";

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
              <HeroTitle>Рейтинг команд</HeroTitle>
              <HeroHint>Valve VRS · {snapshotLabel}</HeroHint>
            </HeroText>
          </HeroLeft>
          <HeroBadge>{formatTeamsCount(rankings.length)}</HeroBadge>
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
            {displayed.map((item) => {
              const tone = rankTone(item.globalRank);
              const share = item.points / topPoints;
              const betCount = betsByTeamKey.get(item.teamKey) ?? 0;

              return (
                <TeamRow key={item.teamKey} $tone={tone}>
                  <RowLeft>
                    <RankNumber $tone={tone}>{item.globalRank}</RankNumber>
                    <LogoRing>
                      <TeamLogo name={item.teamName} size={36} />
                    </LogoRing>
                    <RowInfo>
                      <TeamName>{item.teamName}</TeamName>
                      {betCount > 0 ? (
                        <RowStats>{betCount} ставок</RowStats>
                      ) : null}
                      <ShareTrack>
                        <ShareFill $share={share} $tone={tone} />
                      </ShareTrack>
                    </RowInfo>
                  </RowLeft>
                  <RowRight>
                    <BetsLabel>Очки</BetsLabel>
                    <BetsCount>{item.points}</BetsCount>
                  </RowRight>
                </TeamRow>
              );
            })}
          </ListSection>
        )}
      </TeamsCard>
    </TabRoot>
  );
};

export default TeamsTab;
