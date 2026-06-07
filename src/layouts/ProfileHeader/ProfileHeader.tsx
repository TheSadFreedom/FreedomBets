import { useState } from "react";
import type { Profile } from "@/entities/profile";
import type { Bet } from "@/entities/bet";
import { calcWinRate } from "@/features/bets/lib/calculations";
import ProfileSettingsDialog from "./components/ProfileSettingsDialog/ProfileSettingsDialog";
import {
  ProfileBalance,
  ProfileDivider,
  ProfileHeaderRoot,
  ProfileItem,
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

  return (
    <>
      <ProfileHeaderRoot>
        <ProfileItem>
          <ProfileNameButton type="button" onClick={() => setSettingsOpen(true)}>
            {profile.name}
          </ProfileNameButton>
        </ProfileItem>

        <ProfileDivider />

        <ProfileItem>
          <ProfileBalance $positive={profile.balance >= 0}>
            {profile.balance.toLocaleString("ru-RU", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}{" "}
            ₽
          </ProfileBalance>
        </ProfileItem>

        <ProfileDivider />

        <ProfileItem>
          <ProfileWinRate>{winRate}%</ProfileWinRate>
        </ProfileItem>
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
