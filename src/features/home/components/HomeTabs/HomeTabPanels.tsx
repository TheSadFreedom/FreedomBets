import { Suspense } from "react";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor, PickemStageName } from "@/entities/pickem";
import { MAJOR_EVENT_TIERS, NON_MAJOR_EVENT_TIERS } from "@/entities/event";
import type { RankingBaseline } from "@/entities/ranking";
import type { Profile } from "@/entities/profile";
import { resolveBalanceTotals } from "@/features/profile/lib/profileBalance";
import HomeTabLoader from "./HomeTabLoader";
import {
  LazyBetsHistory,
  LazyEventStats,
  LazyMatchesTab,
  LazyPickemTab,
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
  rankingBaseline: RankingBaseline | null;
  onRefreshRankingBaseline: (force?: boolean) => Promise<RankingBaseline | null>;
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
  rankingBaseline,
  onRefreshRankingBaseline,
}: HomeTabPanelsProps) => {
  const activeProfile = profiles.find((item) => item.id === activeProfileId);
  const { totalDeposited, totalWithdrawn } = activeProfile
    ? resolveBalanceTotals(activeProfile)
    : { totalDeposited: 0, totalWithdrawn: 0 };

  return (
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
            rankingBaseline={rankingBaseline}
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
          <LazyStatsSummary
            bets={bets}
            balance={balance}
            totalDeposited={totalDeposited}
            totalWithdrawn={totalWithdrawn}
            events={events}
          />
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(3) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-teams"
        aria-labelledby="home-tab-teams"
        hidden={tab !== 3}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyTeamsTab
            allBets={allBets}
            rankingBaseline={rankingBaseline}
            onRefreshRankingBaseline={onRefreshRankingBaseline}
          />
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(4) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-events"
        aria-labelledby="home-tab-events"
        hidden={tab !== 4}
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

    {mountedTabs.has(5) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-majors"
        aria-labelledby="home-tab-majors"
        hidden={tab !== 5}
      >
        <Suspense fallback={<HomeTabLoader />}>
          <LazyEventStats
            bets={majorBets}
            allBets={allBets}
            matches={matches}
            events={events}
            summarySections={[{ title: "Major", bets: majorBets, tier: "Major" }]}
            tierFilterOptions={MAJOR_EVENT_TIERS}
            emptyMessage="Нет major турниров — назначьте статус Major при создании или редактировании турнира"
            notFoundMessage="Нет major турниров по выбранным фильтрам"
            onUpdateEvent={onUpdateEvent}
            onDeleteEvent={onDeleteEvent}
          />
        </Suspense>
      </TabsPanel>
    ) : null}

    {mountedTabs.has(6) ? (
      <TabsPanel
        role="tabpanel"
        id="home-tabpanel-pickem"
        aria-labelledby="home-tab-pickem"
        hidden={tab !== 6}
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
};

export default HomeTabPanels;
