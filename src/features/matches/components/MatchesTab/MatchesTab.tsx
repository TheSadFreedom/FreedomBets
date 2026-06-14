import { useMemo, useState } from "react";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { RankingBaseline } from "@/entities/ranking";
import type { Profile } from "@/entities/profile";
import { findBetsForMatch } from "@/features/matches/lib/findBetsForMatch";
import {
  filterMatchesByStatus,
  type MatchStatusFilter,
} from "@/features/matches/lib/filterMatchesByStatus";
import { searchMatches } from "@/features/matches/lib/matchSearch";
import { countPendingMatchBets } from "@/features/matches/lib/settleBetsForMatch";
import { splitMatchesByEffectiveStatus } from "@/features/matches/lib/sortMatches";
import MatchCard from "../MatchCard/MatchCard";
import MatchFormDialog from "../MatchFormDialog/MatchFormDialog";
import MatchesTabSearchBar from "./MatchesTabSearchBar";
import {
  EmptySearch,
  EmptyState,
  MatchList,
  MatchSection,
  MatchSectionTitle,
  MatchesCard,
  MatchesScrollArea,
  TabRoot,
} from "./MatchesTab.styled";

interface MatchesTabProps {
  bets: Bet[];
  allBets: Bet[];
  profiles: Profile[];
  activeProfileId: number;
  events: EventRecord[];
  matches: Match[];
  rankingBaseline?: RankingBaseline | null;
  onUpdateMatch: (match: Match, values: MatchCreateInput) => Promise<void>;
  onSettleMatchBets: (match: Match) => Promise<{ settled: number; skipped: number }>;
  onDeleteMatch: (match: Match) => Promise<void>;
  onBetMatch: (match: Match, team: BetTeamSide) => void;
  onEditBet: (bet: Bet) => void;
  onSyncSportsRu?: (options: { dates: string[] }) => Promise<void>;
}

const MatchesTab = ({
  bets,
  allBets,
  profiles,
  activeProfileId,
  events,
  matches,
  rankingBaseline = null,
  onUpdateMatch,
  onSettleMatchBets,
  onDeleteMatch,
  onBetMatch,
  onEditBet,
  onSyncSportsRu,
}: MatchesTabProps) => {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MatchStatusFilter>("all");

  const filteredMatches = useMemo(() => {
    const searched = searchMatches(matches, search, events);
    return filterMatchesByStatus(searched, statusFilter);
  }, [matches, search, events, statusFilter]);

  const { live: liveMatches, scheduled: scheduledMatches, finished: finishedMatches } =
    useMemo(() => splitMatchesByEffectiveStatus(filteredMatches), [filteredMatches]);

  const statusFilteredMatches = useMemo(() => {
    if (statusFilter === "live") return liveMatches;
    if (statusFilter === "scheduled") return scheduledMatches;
    if (statusFilter === "finished") return finishedMatches;
    return [];
  }, [statusFilter, liveMatches, scheduledMatches, finishedMatches]);

  const profileNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of profiles) {
      map.set(item.id, item.name);
    }
    return map;
  }, [profiles]);

  const relatedBetsByMatchId = useMemo(() => {
    const map = new Map<string, Bet[]>();
    for (const match of filteredMatches) {
      map.set(match.id, findBetsForMatch(match, allBets, matches));
    }
    return map;
  }, [filteredMatches, allBets, matches]);

  const pendingSettlementsByMatchId = useMemo(() => {
    const map = new Map<string, number>();
    for (const match of filteredMatches) {
      map.set(match.id, countPendingMatchBets(match, allBets, matches));
    }
    return map;
  }, [filteredMatches, allBets, matches]);

  const hasMatches = matches.length > 0;
  const hasFilteredMatches =
    liveMatches.length > 0 || scheduledMatches.length > 0 || finishedMatches.length > 0;

  const closeDialog = () => {
    setEditingMatch(null);
  };

  const renderMatch = (match: Match) => (
    <MatchCard
      key={match.id}
      match={match}
      allMatches={matches}
      relatedBets={relatedBetsByMatchId.get(match.id) ?? []}
      profileNameById={profileNameById}
      activeProfileId={activeProfileId}
      pendingSettlements={pendingSettlementsByMatchId.get(match.id) ?? 0}
      onBet={(team) => onBetMatch(match, team)}
      onEdit={() => setEditingMatch(match)}
      onDelete={() => void onDeleteMatch(match)}
      onSettleBets={() => onSettleMatchBets(match)}
      onEditBet={onEditBet}
      events={events}
      rankingBaseline={rankingBaseline}
      externalUrl={match.sportsRuUrl ?? undefined}
    />
  );

  return (
    <TabRoot>
      <MatchesCard>
        <MatchesTabSearchBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSyncSportsRu={onSyncSportsRu}
        />

        {!hasMatches ? (
          <MatchesScrollArea>
            <EmptyState>Нет матчей. Добавьте вручную или обновите с Sports.ru.</EmptyState>
          </MatchesScrollArea>
        ) : (
          <MatchesScrollArea>
            {!hasFilteredMatches ? (
              <EmptySearch>Ничего не найдено</EmptySearch>
            ) : statusFilter !== "all" ? (
              <MatchList>{statusFilteredMatches.map(renderMatch)}</MatchList>
            ) : (
              <>
                {liveMatches.length > 0 ? (
                  <MatchSection>
                    <MatchSectionTitle>Live</MatchSectionTitle>
                    <MatchList>{liveMatches.map(renderMatch)}</MatchList>
                  </MatchSection>
                ) : null}

                {scheduledMatches.length > 0 ? (
                  <MatchSection>
                    <MatchSectionTitle>Скоро</MatchSectionTitle>
                    <MatchList>{scheduledMatches.map(renderMatch)}</MatchList>
                  </MatchSection>
                ) : null}

                {finishedMatches.length > 0 ? (
                  <MatchSection>
                    <MatchSectionTitle>Завершённые</MatchSectionTitle>
                    <MatchList>{finishedMatches.map(renderMatch)}</MatchList>
                  </MatchSection>
                ) : null}
              </>
            )}
          </MatchesScrollArea>
        )}
      </MatchesCard>

      <MatchFormDialog
        open={Boolean(editingMatch)}
        bets={bets}
        events={events}
        initial={editingMatch ?? undefined}
        onClose={closeDialog}
        onSubmit={async (values) => {
          if (!editingMatch) return;
          await onUpdateMatch(editingMatch, values);
        }}
      />
    </TabRoot>
  );
};

export default MatchesTab;
