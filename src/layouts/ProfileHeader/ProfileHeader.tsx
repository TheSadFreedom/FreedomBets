import { useMemo, useState } from "react";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { Profile } from "@/entities/profile";
import type { Bet } from "@/entities/bet";
import { calcWinRate, getSettledBets } from "@/features/bets/lib/calculations";
import AppSettingsDialog from "./components/AppSettingsDialog/AppSettingsDialog";
import ProfileDialog from "./components/ProfileDialog/ProfileDialog";
import type { AppCreateActions } from "./types";
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
  SettingsButton,
} from "./ProfileHeader.styled";

interface ProfileHeaderProps {
  profile: Profile;
  bets: Bet[];
  createActions?: AppCreateActions;
  onSyncSportsRu?: (options: { dates: string[] }) => Promise<void>;
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
  createActions,
  onSyncSportsRu,
  onSetBalance,
  onUpdateName,
  onDeleteProfile,
  onExitProfile,
}: ProfileHeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
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
            <ProfileNameButton type="button" onClick={() => setProfileOpen(true)}>
              {profile.name}
            </ProfileNameButton>
            <ProfileHint>Профиль</ProfileHint>
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

        <SettingsButton
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Настройки"
          title="Настройки"
        >
          <SettingsOutlinedIcon />
        </SettingsButton>
      </ProfileHeaderRoot>

      <ProfileDialog
        open={profileOpen}
        profile={profile}
        onClose={() => setProfileOpen(false)}
        onUpdateName={onUpdateName}
        onSetBalance={onSetBalance}
        onDeleteProfile={onDeleteProfile}
        onExitProfile={onExitProfile}
      />

      <AppSettingsDialog
        open={settingsOpen}
        createActions={createActions}
        onSyncSportsRu={onSyncSportsRu}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default ProfileHeader;
