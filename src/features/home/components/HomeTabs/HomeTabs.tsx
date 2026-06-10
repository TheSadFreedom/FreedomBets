import { useMemo, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor, PickemStageName } from "@/entities/pickem";
import { MAJOR_EVENT_TIERS, NON_MAJOR_EVENT_TIERS } from "@/entities/event";
import BetsHistory from "@/features/bets/components/BetsHistory/BetsHistory";
import EventStats from "@/features/events/components/EventStats/EventStats";
import {
  filterBetsByTier,
  filterMajorBets,
  filterNonMajorBets,
} from "@/features/events/lib/isMajorEvent";
import MatchesTab from "@/features/matches/components/MatchesTab/MatchesTab";
import StatsSummary from "@/features/summary/components/StatsSummary/StatsSummary";
import PickemTab from "@/features/pickem/components/PickemTab/PickemTab";
import ProfileRankingTab from "@/features/profile/components/ProfileRankingTab/ProfileRankingTab";
import TeamsTab from "@/features/teams/components/TeamsTab/TeamsTab";
import type { Profile } from "@/entities/profile";

interface ProfileNavHandlers {
  onSetBalance: (balance: number) => Promise<void>;
  onUpdateName: (name: string) => Promise<void>;
  onDeleteProfile: () => Promise<void>;
  onExitProfile: () => void;
}
import { getMobileTabIcon, HOME_TABS } from "./homeTabsConfig";
import HomeMobileNav from "./HomeMobileNav";
import {
  MobileTabHeader,
  MobileTabHeaderIcon,
  MobileTabHeaderTitle,
  TabLabel,
  TabsBar,
  TabsPanel,
  TabsRoot,
} from "./HomeTabs.styled";

interface HomeTabsProps extends ProfileNavHandlers {
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
  onAddPickemMajor: (eventOrganization: string, eventName: string) => Promise<void>;
  onUploadPickemStageImage: (
    major: PickemMajor,
    stage: PickemStageName,
    file: File
  ) => Promise<void>;
  onDeletePickemMajor: (major: PickemMajor) => Promise<void>;
  medals: ProfileMedal[];
  onUploadMedal: (imageData: string) => Promise<void>;
  onDeleteMedal: (medal: ProfileMedal) => Promise<void>;
}

const HomeTabs = ({
  profile,
  profiles,
  allBets,
  activeProfileId,
  bets,
  balance,
  onSetBalance,
  onUpdateName,
  onDeleteProfile,
  onExitProfile,
  matches,
  onUpdateMatch,
  onSettleMatchBets,
  onDeleteMatch,
  onBetMatch,
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
  events,
  onUpdateEvent,
  onDeleteEvent,
  pickems,
  onAddPickemMajor,
  onUploadPickemStageImage,
  onDeletePickemMajor,
  medals,
  onUploadMedal,
  onDeleteMedal,
}: HomeTabsProps) => {
  const [tab, setTab] = useState(0);
  const majorBets = useMemo(() => filterMajorBets(bets, events), [bets, events]);
  const nonMajorBets = useMemo(() => filterNonMajorBets(bets, events), [bets, events]);
  const bigBets = useMemo(
    () => filterBetsByTier(nonMajorBets, "Big", events),
    [nonMajorBets, events]
  );
  const smallBets = useMemo(
    () => filterBetsByTier(nonMajorBets, "Small", events),
    [nonMajorBets, events]
  );

  const activeTab = HOME_TABS[tab];

  return (
    <TabsRoot>
      <MobileTabHeader aria-hidden={false}>
        <MobileTabHeaderIcon aria-hidden>
          {getMobileTabIcon(activeTab.id)}
        </MobileTabHeaderIcon>
        <MobileTabHeaderTitle>{activeTab.label}</MobileTabHeaderTitle>
      </MobileTabHeader>

      <TabsBar>
        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          aria-label="Разделы главной"
        >
          {HOME_TABS.map((item) => (
            <Tab
              key={item.id}
              icon={item.icon}
              iconPosition="start"
              label={<TabLabel $compact>{item.label}</TabLabel>}
              id={`home-tab-${item.id}`}
              aria-label={item.label}
              aria-controls={`home-tabpanel-${item.id}`}
              disableRipple
            />
          ))}
        </Tabs>
      </TabsBar>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-matches"
        aria-labelledby="home-tab-matches"
        hidden={tab !== 0}
      >
        <MatchesTab
          bets={bets}
          allBets={allBets}
          profiles={profiles}
          activeProfileId={activeProfileId}
          events={events}
          matches={matches}
          onUpdateMatch={onUpdateMatch}
          onSettleMatchBets={onSettleMatchBets}
          onDeleteMatch={onDeleteMatch}
          onBetMatch={onBetMatch}
          onEditBet={onEdit}
        />
      </TabsPanel>

      <TabsPanel role="tabpanel" id="home-tabpanel-bets" aria-labelledby="home-tab-bets" hidden={tab !== 1}>
        <BetsHistory
          bets={bets}
          events={events}
          onEdit={onEdit}
          onDelete={onDelete}
          onWin={onWin}
          onLose={onLose}
          onRevert={onRevert}
        />
      </TabsPanel>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-summary"
        aria-labelledby="home-tab-summary"
        hidden={tab !== 2}
      >
        <StatsSummary bets={bets} balance={balance} />
      </TabsPanel>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-ranking"
        aria-labelledby="home-tab-ranking"
        hidden={tab !== 3}
      >
        <ProfileRankingTab
          profiles={profiles}
          allBets={allBets}
          activeProfileId={activeProfileId}
        />
      </TabsPanel>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-teams"
        aria-labelledby="home-tab-teams"
        hidden={tab !== 4}
      >
        <TeamsTab allBets={allBets} />
      </TabsPanel>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-events"
        aria-labelledby="home-tab-events"
        hidden={tab !== 5}
      >
        <EventStats
          bets={nonMajorBets}
          allBets={allBets}
          matches={matches}
          events={events}
          summarySections={[
            { title: "Big", bets: bigBets, tier: "Big" },
            { title: "Small", bets: smallBets, tier: "Small" },
          ]}
          tierFilterOptions={NON_MAJOR_EVENT_TIERS}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
        />
      </TabsPanel>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-majors"
        aria-labelledby="home-tab-majors"
        hidden={tab !== 6}
      >
        <EventStats
          bets={majorBets}
          allBets={allBets}
          matches={matches}
          events={events}
          summarySections={[{ title: "Major", bets: majorBets, tier: "Major" }]}
          showTierFilter={false}
          tierFilterOptions={MAJOR_EVENT_TIERS}
          showMajorStageFilter
          emptyMessage="Нет major турниров — назначьте статус Major при создании или редактировании турнира"
          notFoundMessage="Нет major турниров по выбранным фильтрам"
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
        />
      </TabsPanel>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-pickem"
        aria-labelledby="home-tab-pickem"
        hidden={tab !== 7}
      >
        <PickemTab
          bets={bets}
          events={events}
          pickems={pickems}
          medals={medals}
          onAddMajor={onAddPickemMajor}
          onUploadStageImage={onUploadPickemStageImage}
          onDeleteMajor={onDeletePickemMajor}
          onUploadMedal={onUploadMedal}
          onDeleteMedal={onDeleteMedal}
        />
      </TabsPanel>

      <HomeMobileNav
        activeTab={tab}
        onTabChange={setTab}
        profile={profile}
        onSetBalance={onSetBalance}
        onUpdateName={onUpdateName}
        onDeleteProfile={onDeleteProfile}
        onExitProfile={onExitProfile}
      />
    </TabsRoot>
  );
};

export default HomeTabs;
