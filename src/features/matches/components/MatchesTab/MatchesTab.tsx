import { useEffect, useMemo, useState } from "react";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { Profile } from "@/entities/profile";
import { findBetsForMatch } from "@/features/matches/lib/findBetsForMatch";
import { sortMatchesByDateTime } from "@/features/matches/lib/sortMatches";
import MatchCard from "../MatchCard/MatchCard";
import MatchFormDialog from "../MatchFormDialog/MatchFormDialog";
import { EmptyState, MatchList, TabRoot, Toolbar, ToolbarTitle } from "./MatchesTab.styled";

interface MatchesTabProps {
  isAdmin?: boolean;
  bets: Bet[];
  allBets: Bet[];
  profiles: Profile[];
  activeProfileId: number;
  events: EventRecord[];
  matches: Match[];
  onUpdateMatch: (match: Match, values: MatchCreateInput) => Promise<void>;
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
  onDeleteMatch,
  onBetMatch,
  onEditBet,
}: MatchesTabProps) => {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [statusClock, setStatusClock] = useState(0);
  const sorted = useMemo(() => sortMatchesByDateTime(matches), [matches]);
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

  useEffect(() => {
    const id = window.setInterval(() => setStatusClock((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const closeDialog = () => {
    setEditingMatch(null);
  };

  return (
    <TabRoot>
      <Toolbar>
        <ToolbarTitle>Матчи</ToolbarTitle>
      </Toolbar>

      {sorted.length === 0 ? (
        <EmptyState>Нет матчей. Добавьте первый матч вручную.</EmptyState>
      ) : (
        <MatchList>
          {sorted.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              relatedBets={relatedBetsByMatchId.get(match.id) ?? []}
              profileNameById={profileNameById}
              activeProfileId={activeProfileId}
              statusClock={statusClock}
              isAdmin={isAdmin}
              onBet={(team) => onBetMatch(match, team)}
              onEdit={() => setEditingMatch(match)}
              onDelete={() => void onDeleteMatch(match)}
              onEditBet={isAdmin ? onEditBet : undefined}
            />
          ))}
        </MatchList>
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
