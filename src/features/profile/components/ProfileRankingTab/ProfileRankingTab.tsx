import { useMemo } from "react";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import type { Bet } from "@/entities/bet";
import type { Profile } from "@/entities/profile";
import { buildProfileRankings } from "@/features/profile/lib/buildProfileRankings";
import type { ProfileRankingRow } from "@/features/profile/lib/buildProfileRankings";
import { formatMoneySigned } from "@/shared/lib/format/money";
import {
  Avatar,
  EmptyState,
  HeroBadge,
  HeroCard,
  HeroContent,
  HeroGlow,
  HeroIcon,
  HeroSubtitle,
  HeroText,
  HeroTitle,
  HeroTitleRow,
  ListSection,
  ListTitle,
  MetaPill,
  PodiumCard,
  PodiumMeta,
  PodiumProfit,
  PodiumSection,
  ProfileName,
  ProfitLabel,
  ProfitValue,
  RankMedal,
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

const PodiumSlot = ({
  row,
  rank,
  activeProfileId,
  settled,
  solo = false,
}: {
  row: ProfileRankingRow;
  rank: 1 | 2 | 3;
  activeProfileId?: number;
  settled: number;
  solo?: boolean;
}) => {
  const isActive = row.profileId === activeProfileId;

  return (
    <PodiumCard $rank={rank} $active={isActive} $solo={solo}>
      <RankMedal $rank={rank}>#{rank}</RankMedal>
      <Avatar $rank={rank} $active={isActive}>
        {profileInitial(row.name)}
      </Avatar>
      <ProfileName $active={isActive} $large={rank === 1}>
        {row.name}
      </ProfileName>
      <PodiumProfit $positive={row.profit >= 0}>{formatMoneySigned(row.profit)}</PodiumProfit>
      <PodiumMeta>
        <MetaPill>{row.totalBets} ставок</MetaPill>
        <MetaPill>{settled > 0 ? `${row.winRate}% WR` : "— WR"}</MetaPill>
      </PodiumMeta>
    </PodiumCard>
  );
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

  const podium = rankings.slice(0, 3);
  const rest = rankings.slice(3);
  const leader = rankings[0];

  const renderPodium = () => {
    if (podium.length === 0) return null;

    if (podium.length === 1) {
      return (
        <PodiumSection $count={1}>
          <PodiumSlot
            row={podium[0]}
            rank={1}
            activeProfileId={activeProfileId}
            settled={settledCountByProfile.get(podium[0].profileId) ?? 0}
            solo
          />
        </PodiumSection>
      );
    }

    if (podium.length === 2) {
      return (
        <PodiumSection $count={2}>
          <PodiumSlot
            row={podium[0]}
            rank={1}
            activeProfileId={activeProfileId}
            settled={settledCountByProfile.get(podium[0].profileId) ?? 0}
          />
          <PodiumSlot
            row={podium[1]}
            rank={2}
            activeProfileId={activeProfileId}
            settled={settledCountByProfile.get(podium[1].profileId) ?? 0}
          />
        </PodiumSection>
      );
    }

    return (
      <PodiumSection $count={3}>
        <PodiumSlot
          row={podium[1]}
          rank={2}
          activeProfileId={activeProfileId}
          settled={settledCountByProfile.get(podium[1].profileId) ?? 0}
        />
        <PodiumSlot
          row={podium[0]}
          rank={1}
          activeProfileId={activeProfileId}
          settled={settledCountByProfile.get(podium[0].profileId) ?? 0}
        />
        <PodiumSlot
          row={podium[2]}
          rank={3}
          activeProfileId={activeProfileId}
          settled={settledCountByProfile.get(podium[2].profileId) ?? 0}
        />
      </PodiumSection>
    );
  };

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
            <HeroSubtitle>Рейтинг по закрытому профиту · WIN и LOSE</HeroSubtitle>
          </HeroText>
          <HeroBadge>
            {rankings.length} {rankings.length === 1 ? "игрок" : "игроков"}
            {leader ? ` · лидер ${leader.name}` : ""}
          </HeroBadge>
        </HeroContent>
      </HeroCard>

      {rankings.length === 0 ? (
        <EmptyState>Нет профилей для рейтинга</EmptyState>
      ) : (
        <RankingCard>
          {renderPodium()}

          {rest.length > 0 ? (
            <ListSection>
              <ListTitle>Остальные места</ListTitle>
              {rest.map((row, index) => {
                const rank = index + 4;
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
          ) : null}
        </RankingCard>
      )}
    </TabRoot>
  );
};

export default ProfileRankingTab;
