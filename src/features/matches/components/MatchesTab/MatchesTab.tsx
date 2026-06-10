import { useEffect, useMemo, useState } from "react";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { Profile } from "@/entities/profile";
import { findBetsForMatch } from "@/features/matches/lib/findBetsForMatch";
import { countPendingMatchBets } from "@/features/matches/lib/settleBetsForMatch";
import { splitMatchesByEffectiveStatus } from "@/features/matches/lib/sortMatches";
import MatchCard from "../MatchCard/MatchCard";
import MatchFormDialog from "../MatchFormDialog/MatchFormDialog";
import {
  EmptyState,
  MatchList,
  MatchSection,
  MatchSectionTitle,
  TabRoot,
} from "./MatchesTab.styled";

interface MatchesTabProps {
  bets: Bet[];
  allBets: Bet[];
  profiles: Profile[];
  activeProfileId: number;
  events: EventRecord[];
  matches: Match[];
  onUpdateMatch: (match: Match, values: MatchCreateInput) => Promise<void>;
  onSettleMatchBets: (match: Match) => Promise<{ settled: number; skipped: number }>;
  onDeleteMatch: (match: Match) => Promise<void>;
  onBetMatch: (match: Match, team: BetTeamSide) => void;
  onEditBet: (bet: Bet) => void;
}

const MatchesTab = ({
  bets,
  allBets,
  profiles,
  activeProfileId,
  events,
  matches,
  onUpdateMatch,
  onSettleMatchBets,
  onDeleteMatch,
  onBetMatch,
  onEditBet,
}: MatchesTabProps) => {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [statusClock, setStatusClock] = useState(0);
  const { live: liveMatches, scheduled: scheduledMatches, finished: finishedMatches } =
    useMemo(() => splitMatchesByEffectiveStatus(matches), [matches, statusClock]);
  const profileNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of profiles) {
      map.set(item.id, item.name);
    }
    return map;
  }, [profiles]);

  const relatedBetsByMatchId = useMemo(() => {
    const map = new Map<string, Bet[]>();
    for (const match of matches) {
      map.set(match.id, findBetsForMatch(match, allBets));
    }
    return map;
  }, [matches, allBets]);

  const pendingSettlementsByMatchId = useMemo(() => {
    const map = new Map<string, number>();
    for (const match of matches) {
      map.set(match.id, countPendingMatchBets(match, allBets));
    }
    return map;
  }, [matches, allBets]);

  useEffect(() => {
    const id = window.setInterval(() => setStatusClock((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const closeDialog = () => {
    setEditingMatch(null);
  };

  const renderMatch = (match: Match) => (
    <MatchCard
      key={match.id}
      match={match}
      relatedBets={relatedBetsByMatchId.get(match.id) ?? []}
      profileNameById={profileNameById}
      activeProfileId={activeProfileId}
      statusClock={statusClock}
      pendingSettlements={pendingSettlementsByMatchId.get(match.id) ?? 0}
      onBet={(team) => onBetMatch(match, team)}
      onEdit={() => setEditingMatch(match)}
      onDelete={() => void onDeleteMatch(match)}
      onSettleBets={() => onSettleMatchBets(match)}
      onEditBet={onEditBet}
      events={events}
    />
  );

  const hasMatches =
    liveMatches.length > 0 || scheduledMatches.length > 0 || finishedMatches.length > 0;

  return (
    <TabRoot>
      {!hasMatches ? (
        <EmptyState>Нет матчей. Добавьте первый матч вручную.</EmptyState>
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

      <MatchFormDialog
        open={Boolean(editingMatch)}
        bets={bets}
        allBets={allBets}
        matches={matches}
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
