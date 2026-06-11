import { Suspense } from "react";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor, PickemStageName } from "@/entities/pickem";
import { MAJOR_EVENT_TIERS, NON_MAJOR_EVENT_TIERS } from "@/entities/event";
import type { Profile } from "@/entities/profile";
import HomeTabLoader from "./HomeTabLoader";
import {
  LazyBetsHistory,
  LazyEventStats,
  LazyMatchesTab,
  LazyPickemTab,
  LazyProfileRankingTab,
  LazyStatsSummary,
  LazyTeamsTab,
} from "./lazyHomeTabs";
import { TabsPanel } from "./HomeTabs.styled";

export interface HomeTabPanelsProps {
  tab: number;
  mountedTabs: ReadonlySet<number>;
  bets: Bet[];
  allBets: Bet[];
  balance: number;
  matches: Match[];
  events: EventRecord[];
  profiles: Profile[];
  activeProfileId: number;
  pickems: PickemMajor[];
  medals: ProfileMedal[];
  majorBets: Bet[];
  nonMajorBets: Bet[];
  bigBets: Bet[];
  smallBets: Bet[];
  onUpdateMatch: (match: Match, values: MatchCreateInput) => Promise<void>;
  onSettleMatchBets: (match: Match) => Promise<{ settled: number; skipped: number }>;
  onDeleteMatch: (match: Match) => Promise<void>;
  onBetMatch: (match: Match, team: BetTeamSide) => void;
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
  onUpdateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
  onDeleteEvent: (identity: EventIdentity) => Promise<void>;
  onAddPickemMajor: (eventOrganization: string, eventName: string) => Promise<void>;
  onUploadPickemStageImage: (
    major: PickemMajor,
    stage: PickemStageName,
    file: File,
  ) => Promise<void>;
  onDeletePickemMajor: (major: PickemMajor) => Promise<void>;
  onUploadMedal: (imageData: string) => Promise<void>;
  onDeleteMedal: (medal: ProfileMedal) => Promise<void>;
}

const HomeTabPanels = ({
  tab,
  mountedTabs,
  bets,
  allBets,
  balance,
  matches,
  events,
  profiles,
  activeProfileId,
  pickems,
  medals,
  majorBets,
  nonMajorBets,
  bigBets,
  smallBets,
  onUpdateMatch,
  onSettleMatchBets,
  onDeleteMatch,
  onBetMatch,
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
  onUpdateEvent,
  onDeleteEvent,
  onAddPickemMajor,
  onUploadPickemStageImage,
  onDeletePickemMajor,
  onUploadMedal,
  onDeleteMedal,
}: HomeTabPanelsProps) => (
  <>
    {mountedTabs.has(0) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-matches"
        aria-labelledby="home-tab-matches"
        hidden={tab !== 0}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyMatchesTab
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
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(1) ? (
      <TabsPanel role="tabpanel" id="home-tabpanel-bets" aria-labelledby="home-tab-bets" hidden={tab !== 1}>
        <Suspense fallback={<HomeTabLoader />}>
          <LazyBetsHistory
            bets={bets}
            matches={matches}
            events={events}
            onEdit={onEdit}
            onDelete={onDelete}
            onWin={onWin}
            onLose={onLose}
            onRevert={onRevert}
          />
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(2) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-summary"
        aria-labelledby="home-tab-summary"
        hidden={tab !== 2}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyStatsSummary bets={bets} balance={balance} events={events} />
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(3) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-ranking"
        aria-labelledby="home-tab-ranking"
        hidden={tab !== 3}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyProfileRankingTab
            profiles={profiles}
            allBets={allBets}
            activeProfileId={activeProfileId}
          />
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(4) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-teams"
        aria-labelledby="home-tab-teams"
        hidden={tab !== 4}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyTeamsTab allBets={allBets} />
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(5) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-events"
        aria-labelledby="home-tab-events"
        hidden={tab !== 5}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyEventStats
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
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(6) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-majors"
        aria-labelledby="home-tab-majors"
        hidden={tab !== 6}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyEventStats
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
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(7) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-pickem"
        aria-labelledby="home-tab-pickem"
        hidden={tab !== 7}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyPickemTab
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
        </Suspense>
      </TabsPanel>
    ) : null}
  </>
);

export default HomeTabPanels;
