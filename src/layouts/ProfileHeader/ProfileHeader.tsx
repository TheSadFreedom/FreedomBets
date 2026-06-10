import { useMemo, useState } from "react";
import type { Profile } from "@/entities/profile";
import type { Bet } from "@/entities/bet";
import { calcWinRate, getSettledBets } from "@/features/bets/lib/calculations";
import ProfileSettingsDialog from "./components/ProfileSettingsDialog/ProfileSettingsDialog";
import {
  ProfileAvatar,
  ProfileBalance,
  ProfileCard,
  ProfileHeaderRoot,
  ProfileHint,
  ProfileIdentity,
  ProfileMetricLabel,
  ProfileMetricTile,
  ProfileMetrics,
  ProfileNameButton,
  ProfileWinRate,
} from "./ProfileHeader.styled";

interface ProfileHeaderProps {
  profile: Profile;
  bets: Bet[];
  onSetBalance: (balance: number) => Promise<void>;
  onUpdateName: (name: string) => Promise<void>;
  onDeleteProfile: () => Promise<void>;
  onExitProfile: () => void;
}

const profileInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const ProfileHeader = ({
  profile,
  bets,
  onSetBalance,
  onUpdateName,
  onDeleteProfile,
  onExitProfile,
}: ProfileHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const winRate = calcWinRate(bets);
  const hasSettled = getSettledBets(bets).length > 0;
  const winRateColor = useMemo(() => {
    if (!hasSettled) return undefined;
    return winRate >= 50 ? "#81c784" : "#ef5350";
  }, [hasSettled, winRate]);

  return (
    <>
      <ProfileHeaderRoot>
        <ProfileCard>
          <ProfileAvatar>{profileInitial(profile.name)}</ProfileAvatar>

          <ProfileIdentity>
            <ProfileNameButton type="button" onClick={() => setSettingsOpen(true)}>
              {profile.name}
            </ProfileNameButton>
            <ProfileHint>Настройки</ProfileHint>
          </ProfileIdentity>

          <ProfileMetrics>
            <ProfileMetricTile>
              <ProfileMetricLabel>Баланс</ProfileMetricLabel>
              <ProfileBalance $positive={profile.balance >= 0}>
                {profile.balance.toLocaleString("ru-RU", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
                ₽
              </ProfileBalance>
            </ProfileMetricTile>

            <ProfileMetricTile>
              <ProfileMetricLabel>WR</ProfileMetricLabel>
              <ProfileWinRate $color={winRateColor}>
                {hasSettled ? `${winRate}%` : "—"}
              </ProfileWinRate>
            </ProfileMetricTile>
          </ProfileMetrics>
        </ProfileCard>
      </ProfileHeaderRoot>

      <ProfileSettingsDialog
        open={settingsOpen}
        profile={profile}
        onClose={() => setSettingsOpen(false)}
        onUpdateName={onUpdateName}
        onSetBalance={onSetBalance}
        onDeleteProfile={onDeleteProfile}
        onExitProfile={onExitProfile}
      />
    </>
  );
};

export default ProfileHeader;
