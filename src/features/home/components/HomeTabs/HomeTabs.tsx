import { Tab, Tabs } from "@mui/material";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor, PickemStagePresetId } from "@/entities/pickem";
import type { RankingBaseline } from "@/entities/ranking";
import type { Profile } from "@/entities/profile";
import type { Team, TeamEditInput } from "@/entities/team";
import ScrollToTopButton from "@/features/home/components/ScrollToTopButton/ScrollToTopButton";
import HomeTabPanels from "./HomeTabPanels";
import { HOME_TABS, homeTabShowsScrollToTop } from "./homeTabsConfig";
import { useHomeTabBets } from "./useHomeTabBets";
import { useHomeTabMount } from "./useHomeTabMount";
import { TabLabel, TabsBar, TabsRoot } from "./HomeTabs.styled";

interface HomeTabsProps {
  profile: Profile;
  profiles: Profile[];
  allBets: Bet[];
  activeProfileId: number;
  bets: Bet[];
  balance: number;
  matches: Match[];
  onUpdateMatch: (match: Match, values: MatchCreateInput) => Promise<void>;
  onSettleMatchBets: (match: Match) => Promise<{ settled: number; skipped: number }>;
  onDeleteMatch: (match: Match) => Promise<void>;
  onBetMatch: (match: Match, team: BetTeamSide) => void;
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
  events: EventRecord[];
  onUpdateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
  onDeleteEvent: (identity: EventIdentity) => Promise<void>;
  pickems: PickemMajor[];
  onAddPickemMajor: (eventName: string) => Promise<void>;
  onConfigurePickemStages: (major: PickemMajor, presetId: PickemStagePresetId) => Promise<void>;
  onUploadPickemStageImage: (major: PickemMajor, stage: string, file: File) => Promise<void>;
  onDeletePickemMajor: (major: PickemMajor) => Promise<void>;
  medals: ProfileMedal[];
  onUploadMedal: (imageData: string) => Promise<void>;
  onDeleteMedal: (medal: ProfileMedal) => Promise<void>;
  teams: Team[];
  rankingBaseline: RankingBaseline | null;
  onRefreshRankingBaseline: (force?: boolean) => Promise<RankingBaseline | null>;
  onUpdateTeam: (teamId: string, data: TeamEditInput) => Promise<void>;
  onSyncSportsRu?: (options?: { force?: boolean; dates?: string[] }) => Promise<void>;
}

const HomeTabs = (props: HomeTabsProps) => {
  const { tab, setTab, mountedTabs } = useHomeTabMount();
  const { majorBets, nonMajorBets, bigBets, smallBets } = useHomeTabBets(
    props.bets,
    props.events,
    mountedTabs,
  );

  return (
    <TabsRoot>
      <TabsBar>
        <Tabs
          value={tab}
          variant="fullWidth"
          onChange={(_, value: number) => setTab(value)}
          aria-label="Разделы главной"
        >
          {HOME_TABS.map((item) => (
            <Tab
              key={item.id}
              icon={item.icon}
              iconPosition="start"
              label={<TabLabel>{item.label}</TabLabel>}
              id={`home-tab-${item.id}`}
              aria-label={item.label}
              aria-controls={`home-tabpanel-${item.id}`}
              disableRipple
            />
          ))}
        </Tabs>
      </TabsBar>

      <HomeTabPanels
        tab={tab}
        mountedTabs={mountedTabs}
        majorBets={majorBets}
        nonMajorBets={nonMajorBets}
        bigBets={bigBets}
        smallBets={smallBets}
        {...props}
      />

      <ScrollToTopButton enabled={homeTabShowsScrollToTop(tab)} />
    </TabsRoot>
  );
};

export default HomeTabs;
