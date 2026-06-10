import { useMemo, useState } from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import type { Bet } from "@/entities/bet";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { calcTeamStatsList } from "@/features/teams/lib/calcTeamStatsList";
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
  RowInfo,
  RowLeft,
  RowRight,
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

const TeamsTab = ({ allBets }: TeamsTabProps) => {
  const [search, setSearch] = useState("");

  const stats = useMemo(() => calcTeamStatsList(allBets), [allBets]);
  const topBets = stats[0]?.totalBets ?? 1;
  const rankByName = useMemo(() => {
    const map = new Map<string, number>();
    stats.forEach((item, index) => map.set(item.name, index + 1));
    return map;
  }, [stats]);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stats;
    return stats.filter((item) => item.name.toLowerCase().includes(q));
  }, [stats, search]);

  if (stats.length === 0) {
    return (
      <TabRoot>
        <EmptyState>Нет команд — добавьте ставки с указанием команд</EmptyState>
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
              <HeroTitle>Топ команд</HeroTitle>
              <HeroHint>по количеству ставок</HeroHint>
            </HeroText>
          </HeroLeft>
          <HeroBadge>{formatTeamsCount(stats.length)}</HeroBadge>
        </HeroContent>
      </HeroCard>

      <TeamsCard>
        <Toolbar>
          <FiltersRow>
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
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "10px",
                },
              }}
            />
          </FiltersRow>
        </Toolbar>

        {displayed.length === 0 ? (
          <EmptyState>Ничего не найдено</EmptyState>
        ) : (
          <ListSection>
            {displayed.map((item) => {
              const rank = rankByName.get(item.name) ?? 0;
              const tone = rankTone(rank);
              const share = item.totalBets / topBets;

              return (
                <TeamRow key={item.name} $tone={tone}>
                  <RowLeft>
                    <RankNumber $tone={tone}>{rank}</RankNumber>
                    <LogoRing $tone={tone}>
                      <TeamLogo name={item.name} size={36} />
                    </LogoRing>
                    <RowInfo>
                      <TeamName>{item.name}</TeamName>
                      <ShareTrack>
                        <ShareFill $share={share} $tone={tone} />
                      </ShareTrack>
                    </RowInfo>
                  </RowLeft>
                  <RowRight>
                    <BetsLabel>Ставок</BetsLabel>
                    <BetsCount>{item.totalBets}</BetsCount>
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
