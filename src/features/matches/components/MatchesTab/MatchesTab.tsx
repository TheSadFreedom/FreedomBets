import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useMemo, useState } from "react";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { Profile } from "@/entities/profile";
import { findBetsForMatch } from "@/features/matches/lib/findBetsForMatch";
import { countPendingMatchBets } from "@/features/matches/lib/settleBetsForMatch";
import { splitMatchesByTodayAndPast } from "@/features/matches/lib/sortMatches";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import MatchCard from "../MatchCard/MatchCard";
import MatchFormDialog from "../MatchFormDialog/MatchFormDialog";
import {
  EmptyState,
  FutureSectionBody,
  FutureSectionChevron,
  FutureSectionCount,
  FutureSectionHeading,
  FutureSectionRoot,
  FutureSectionSummary,
  MatchList,
  MatchSection,
  MatchSectionTitle,
  TabRoot,
  Toolbar,
  ToolbarTitle,
} from "./MatchesTab.styled";

interface MatchesTabProps {
  isAdmin?: boolean;
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
  isAdmin = false,
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
  const { future: futureMatches, today: todayMatches, past: pastMatches } = useMemo(
    () => splitMatchesByTodayAndPast(matches, todayIsoDateLocal()),
    [matches, statusClock]
  );
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
      isAdmin={isAdmin}
      pendingSettlements={pendingSettlementsByMatchId.get(match.id) ?? 0}
      onBet={(team) => onBetMatch(match, team)}
      onEdit={() => setEditingMatch(match)}
      onDelete={() => void onDeleteMatch(match)}
      onSettleBets={isAdmin ? () => onSettleMatchBets(match) : undefined}
      onEditBet={isAdmin ? onEditBet : undefined}
    />
  );

  const hasMatches =
    futureMatches.length > 0 || todayMatches.length > 0 || pastMatches.length > 0;

  return (
    <TabRoot>
      <Toolbar>
        <ToolbarTitle>Матчи</ToolbarTitle>
      </Toolbar>

      {!hasMatches ? (
        <EmptyState>Нет матчей. Добавьте первый матч вручную.</EmptyState>
      ) : (
        <>
          {futureMatches.length > 0 ? (
            <FutureSectionRoot>
              <FutureSectionSummary>
                <FutureSectionHeading>
                  Позже сегодня
                  <FutureSectionCount>{futureMatches.length}</FutureSectionCount>
                </FutureSectionHeading>
                <FutureSectionChevron aria-hidden>
                  <ExpandMoreIcon />
                </FutureSectionChevron>
              </FutureSectionSummary>
              <FutureSectionBody>
                <MatchList>{futureMatches.map(renderMatch)}</MatchList>
              </FutureSectionBody>
            </FutureSectionRoot>
          ) : null}

          <MatchSection>
            <MatchSectionTitle>Сегодня</MatchSectionTitle>
            {todayMatches.length === 0 ? (
              <EmptyState>Нет матчей на сегодня</EmptyState>
            ) : (
              <MatchList>{todayMatches.map(renderMatch)}</MatchList>
            )}
          </MatchSection>

          {pastMatches.length > 0 ? (
            <MatchSection>
              <MatchSectionTitle>Прошедшие</MatchSectionTitle>
              <MatchList>{pastMatches.map(renderMatch)}</MatchList>
            </MatchSection>
          ) : null}
        </>
      )}

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
