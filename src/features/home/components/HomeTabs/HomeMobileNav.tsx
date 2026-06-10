import { useMemo, useState } from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import type { Profile } from "@/entities/profile";
import ProfileSettingsDialog from "@/layouts/ProfileHeader/components/ProfileSettingsDialog/ProfileSettingsDialog";
import {
  getHomeTabIndex,
  getMobileTabIcon,
  HOME_TABS,
  MOBILE_MORE_TAB_IDS,
  MOBILE_PRIMARY_TAB_IDS,
  type HomeTabId,
} from "./homeTabsConfig";
import {
  MobileMoreBackdrop,
  MobileMoreHandle,
  MobileMoreGrid,
  MobileMoreItem,
  MobileMoreItemIcon,
  MobileMoreItemLabel,
  MobileMoreSheet,
  MobileMoreTitle,
  MobileNavBar,
  MobileNavIcon,
  MobileNavInner,
  MobileNavItem,
  MobileNavLabel,
  MobileNavProfileAvatar,
  MobileNavSpacer,
} from "./HomeMobileNav.styled";

interface HomeMobileNavProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  profile: Profile;
  onSetBalance: (balance: number) => Promise<void>;
  onUpdateName: (name: string) => Promise<void>;
  onDeleteProfile: () => Promise<void>;
  onExitProfile: () => void;
}

const profileInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const HomeMobileNav = ({
  activeTab,
  onTabChange,
  profile,
  onSetBalance,
  onUpdateName,
  onDeleteProfile,
  onExitProfile,
}: HomeMobileNavProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const primaryTabs = useMemo(
    () => MOBILE_PRIMARY_TAB_IDS.map((id) => HOME_TABS[getHomeTabIndex(id)]),
    []
  );

  const moreTabs = useMemo(
    () => MOBILE_MORE_TAB_IDS.map((id) => HOME_TABS[getHomeTabIndex(id)]),
    []
  );

  const moreTabIndices = useMemo(
    () => MOBILE_MORE_TAB_IDS.map((id) => getHomeTabIndex(id)),
    []
  );

  const isMoreActive = moreTabIndices.includes(activeTab);

  const selectTab = (id: HomeTabId) => {
    onTabChange(getHomeTabIndex(id));
    setMoreOpen(false);
    setSettingsOpen(false);
  };

  const openProfile = () => {
    setMoreOpen(false);
    setSettingsOpen(true);
  };

  return (
    <>
      <MobileNavSpacer aria-hidden />

      <MobileNavBar aria-label="Мобильная навигация">
        <MobileNavInner>
          {primaryTabs.map((tab) => {
            const index = getHomeTabIndex(tab.id);
            const isActive = activeTab === index && !settingsOpen;

            return (
              <MobileNavItem
                key={tab.id}
                type="button"
                $active={isActive}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => selectTab(tab.id)}
              >
                <MobileNavIcon className="mobile-nav-icon">
                  {getMobileTabIcon(tab.id)}
                </MobileNavIcon>
                <MobileNavLabel>{tab.shortLabel ?? tab.label}</MobileNavLabel>
              </MobileNavItem>
            );
          })}

          <MobileNavItem
            type="button"
            $active={(isMoreActive && !settingsOpen) || moreOpen}
            aria-label="Ещё разделы"
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            onClick={() => {
              setSettingsOpen(false);
              setMoreOpen((open) => !open);
            }}
          >
            <MobileNavIcon className="mobile-nav-icon">
              <MoreHorizOutlinedIcon sx={{ fontSize: 22 }} />
            </MobileNavIcon>
            <MobileNavLabel>Ещё</MobileNavLabel>
          </MobileNavItem>

          <MobileNavItem
            type="button"
            $active={settingsOpen}
            aria-label="Профиль"
            aria-haspopup="dialog"
            onClick={openProfile}
          >
            <MobileNavProfileAvatar $active={settingsOpen} className="mobile-nav-icon">
              {profileInitial(profile.name)}
            </MobileNavProfileAvatar>
            <MobileNavLabel>Профиль</MobileNavLabel>
          </MobileNavItem>
        </MobileNavInner>
      </MobileNavBar>

      {moreOpen ? (
        <>
          <MobileMoreBackdrop
            type="button"
            aria-label="Закрыть меню"
            onClick={() => setMoreOpen(false)}
          />
          <MobileMoreSheet role="dialog" aria-label="Дополнительные разделы">
            <MobileMoreHandle aria-hidden />
            <MobileMoreTitle>Разделы</MobileMoreTitle>
            <MobileMoreGrid>
              {moreTabs.map((tab) => {
                const index = getHomeTabIndex(tab.id);
                const isActive = activeTab === index;

                return (
                  <MobileMoreItem
                    key={tab.id}
                    type="button"
                    $active={isActive}
                    onClick={() => selectTab(tab.id)}
                  >
                    <MobileMoreItemIcon>{getMobileTabIcon(tab.id)}</MobileMoreItemIcon>
                    <MobileMoreItemLabel>{tab.label}</MobileMoreItemLabel>
                  </MobileMoreItem>
                );
              })}
            </MobileMoreGrid>
          </MobileMoreSheet>
        </>
      ) : null}

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

export default HomeMobileNav;
