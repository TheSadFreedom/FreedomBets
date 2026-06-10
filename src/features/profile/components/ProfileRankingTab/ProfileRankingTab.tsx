import { useMemo } from "react";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import type { Bet } from "@/entities/bet";
import type { Profile } from "@/entities/profile";
import { buildProfileRankings } from "@/features/profile/lib/buildProfileRankings";
import { formatMoneySigned } from "@/shared/lib/format/money";
import {
  Avatar,
  EmptyState,
  HeroBadge,
  HeroCard,
  HeroContent,
  HeroGlow,
  HeroIcon,
  HeroText,
  HeroTitle,
  HeroTitleRow,
  ListSection,
  MetaPill,
  ProfileName,
  ProfitLabel,
  ProfitValue,
  RankNumber,
  RankingCard,
  RankingRow,
  RowInfo,
  RowLeft,
  RowRight,
  RowStats,
  TabRoot,
} from "./ProfileRankingTab.styled";

interface ProfileRankingTabProps {
  profiles: Profile[];
  allBets: Bet[];
  activeProfileId?: number;
}

const profileInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const ProfileRankingTab = ({ profiles, allBets, activeProfileId }: ProfileRankingTabProps) => {
  const rankings = useMemo(
    () => buildProfileRankings(profiles, allBets),
    [profiles, allBets]
  );

  const settledCountByProfile = useMemo(() => {
    const map = new Map<number, number>();
    for (const bet of allBets) {
      if (bet.status !== "WIN" && bet.status !== "LOSE") continue;
      map.set(bet.profileId, (map.get(bet.profileId) ?? 0) + 1);
    }
    return map;
  }, [allBets]);

  return (
    <TabRoot>
      <HeroCard>
        <HeroGlow aria-hidden />
        <HeroContent>
          <HeroText>
            <HeroTitleRow>
              <HeroIcon aria-hidden>
                <EmojiEventsOutlinedIcon sx={{ fontSize: 20 }} />
              </HeroIcon>
              <HeroTitle>Топ профилей</HeroTitle>
            </HeroTitleRow>
          </HeroText>
          <HeroBadge>
            {rankings.length} {rankings.length === 1 ? "игрок" : "игроков"}
          </HeroBadge>
        </HeroContent>
      </HeroCard>

      {rankings.length === 0 ? (
        <EmptyState>Нет профилей для рейтинга</EmptyState>
      ) : (
        <RankingCard>
          <ListSection>
            {rankings.map((row, index) => {
              const rank = index + 1;
              const settled = settledCountByProfile.get(row.profileId) ?? 0;
              const isActive = row.profileId === activeProfileId;

              return (
                <RankingRow key={row.profileId} $active={isActive}>
                  <RowLeft>
                    <RankNumber>{rank}</RankNumber>
                    <Avatar $active={isActive}>{profileInitial(row.name)}</Avatar>
                    <RowInfo>
                      <ProfileName $active={isActive}>{row.name}</ProfileName>
                      <RowStats>
                        <MetaPill>{row.totalBets} ставок</MetaPill>
                        <MetaPill>{settled > 0 ? `${row.winRate}%` : "—"} винрейт</MetaPill>
                      </RowStats>
                    </RowInfo>
                  </RowLeft>
                  <RowRight>
                    <ProfitLabel>Профит</ProfitLabel>
                    <ProfitValue $positive={row.profit >= 0}>
                      {formatMoneySigned(row.profit)}
                    </ProfitValue>
                  </RowRight>
                </RankingRow>
              );
            })}
          </ListSection>
        </RankingCard>
      )}
    </TabRoot>
  );
};

export default ProfileRankingTab;
