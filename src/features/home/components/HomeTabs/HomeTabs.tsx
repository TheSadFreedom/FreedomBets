import { useMemo, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor, PickemStageName } from "@/entities/pickem";
import BetsHistory from "@/features/bets/components/BetsHistory/BetsHistory";
import { NON_MAJOR_EVENT_TIERS } from "@/entities/event";
import EventStats from "@/features/events/components/EventStats/EventStats";
import MajorEventStats from "@/features/events/components/MajorEventStats/MajorEventStats";
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
import { TabLabel, TabsBar, TabsPanel, TabsRoot } from "./HomeTabs.styled";

interface HomeTabsProps {
  isAdmin?: boolean;
  profiles: Profile[];
  allBets: Bet[];
  activeProfileId: number;
  bets: Bet[];
  matches: Match[];
  onUpdateMatch: (match: Match, values: MatchCreateInput) => Promise<void>;
  onDeleteMatch: (match: Match) => Promise<void>;
  onBetMatch: (match: Match, team: BetTeamSide) => void;
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
  events: EventRecord[];
  onUpdateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
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

const tabIconSx = { fontSize: 17 } as const;

const HOME_TABS = [
  {
    label: "Матчи",
    id: "matches",
    icon: <SportsEsportsOutlinedIcon sx={tabIconSx} />,
  },
  {
    label: "История",
    id: "bets",
    icon: <ReceiptLongOutlinedIcon sx={tabIconSx} />,
  },
  {
    label: "Статистика",
    id: "summary",
    icon: <InsightsOutlinedIcon sx={tabIconSx} />,
  },
  {
    label: "Топ",
    id: "ranking",
    icon: <EmojiEventsOutlinedIcon sx={tabIconSx} />,
  },
  {
    label: "Команды",
    id: "teams",
    icon: <GroupsOutlinedIcon sx={tabIconSx} />,
  },
  {
    label: "Ивенты",
    id: "events",
    icon: <EventOutlinedIcon sx={tabIconSx} />,
  },
  {
    label: "Major",
    id: "majors",
    icon: <WorkspacePremiumOutlinedIcon sx={tabIconSx} />,
  },
  {
    label: "Pick'em",
    id: "pickem",
    icon: <HowToVoteOutlinedIcon sx={tabIconSx} />,
  },
] as const;

const HomeTabs = ({
  isAdmin = false,
  profiles,
  allBets,
  activeProfileId,
  bets,
  matches,
  onUpdateMatch,
  onDeleteMatch,
  onBetMatch,
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
  events,
  onUpdateEvent,
  pickems,
  onAddPickemMajor,
  onUploadPickemStageImage,
  onDeletePickemMajor,
  medals,
  onUploadMedal,
  onDeleteMedal,
}: HomeTabsProps) => {
  const [tab, setTab] = useState(0);
  const majorBets = useMemo(() => filterMajorBets(bets), [bets]);
  const nonMajorBets = useMemo(() => filterNonMajorBets(bets), [bets]);
  const bigBets = useMemo(() => filterBetsByTier(nonMajorBets, "Big"), [nonMajorBets]);
  const smallBets = useMemo(() => filterBetsByTier(nonMajorBets, "Small"), [nonMajorBets]);

  return (
    <TabsRoot>
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
              label={<TabLabel>{item.label}</TabLabel>}
              id={`home-tab-${item.id}`}
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
          isAdmin={isAdmin}
          bets={bets}
          allBets={allBets}
          profiles={profiles}
          activeProfileId={activeProfileId}
          events={events}
          matches={matches}
          onUpdateMatch={onUpdateMatch}
          onDeleteMatch={onDeleteMatch}
          onBetMatch={onBetMatch}
          onEditBet={onEdit}
        />
      </TabsPanel>

      <TabsPanel role="tabpanel" id="home-tabpanel-bets" aria-labelledby="home-tab-bets" hidden={tab !== 1}>
        <BetsHistory
          bets={bets}
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
        <StatsSummary bets={bets} />
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
          isAdmin={isAdmin}
          bets={nonMajorBets}
          events={events}
          summarySections={[
            { title: "Big", bets: bigBets },
            { title: "Small", bets: smallBets },
          ]}
          tierFilterOptions={NON_MAJOR_EVENT_TIERS}
          onUpdateEvent={onUpdateEvent}
        />
      </TabsPanel>

      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-majors"
        aria-labelledby="home-tab-majors"
        hidden={tab !== 6}
      >
        <MajorEventStats
          isAdmin={isAdmin}
          bets={majorBets}
          events={events}
          onUpdateEvent={onUpdateEvent}
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
    </TabsRoot>
  );
};

export default HomeTabs;
