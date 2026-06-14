import { useCallback, useEffect, useMemo, useState } from "react";
import type { Bet } from "@/entities/bet";
import type { EventEditInput } from "@/entities/event";
import type { Match } from "@/entities/match";
import type { Team, TeamEditInput } from "@/entities/team";
import { resolveTeamIdFromName } from "@/entities/team";
import BetFormDialog, {
  type BetFormSeed,
} from "@/features/bets/components/BetFormDialog/BetFormDialog";
import EventFormDialog from "@/features/events/components/EventFormDialog/EventFormDialog";
import HomeTabs from "@/features/home/components/HomeTabs/HomeTabs";
import MatchFormDialog from "@/features/matches/components/MatchFormDialog/MatchFormDialog";
import { matchToBetSeed } from "@/features/matches/lib/matchToBetSeed";
import TeamFormDialog from "@/features/teams/components/TeamFormDialog/TeamFormDialog";
import type { AppCreateActions } from "@/layouts/ProfileHeader/types";
import PageError from "@/shared/ui/PageError/PageError";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";
import type { ProfileBetsState } from "./types";
import { Container } from "./HomePage.styled";

interface HomePageProps {
  profileBets: ProfileBetsState;
  onRegisterCreateActions?: (actions: AppCreateActions) => void;
}

const emptyCreateTeam = (): Team => ({
  id: "",
  name: "",
  synonyms: [],
  logoSlug: "",
  vrsPoints: 0,
});

const HomePage = ({ profileBets, onRegisterCreateActions }: HomePageProps) => {
  const {
    profile,
    profiles,
    bets,
    allBets,
    matches,
    loading,
    error,
    reload,
    addBet,
    updateBet,
    deleteBet,
    settleWin,
    settleLose,
    revertToPending,
    addMatch,
    updateMatch,
    syncSportsRuMatches,
    settleMatchBets,
    deleteMatch,
    addEvent,
    updateEvent,
    deleteEvent,
    events,
    pickems,
    addPickemMajor,
    configurePickemStages,
    uploadPickemStageImage,
    deletePickemMajor,
    medals,
    uploadMedal,
    deleteMedal,
    rankingBaseline,
    teams,
    refreshRankingBaseline,
    updateTeam,
  } = profileBets;

  const [createBetOpen, setCreateBetOpen] = useState(false);
  const [createMatchOpen, setCreateMatchOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const createTeamDraft = useMemo(() => emptyCreateTeam(), []);
  const [editingBet, setEditingBet] = useState<Bet | null>(null);
  const [betSeed, setBetSeed] = useState<BetFormSeed | undefined>();

  const openCreateBet = useCallback((seed?: BetFormSeed) => {
    setBetSeed(seed);
    setCreateBetOpen(true);
  }, []);

  useEffect(() => {
    onRegisterCreateActions?.({
      onNewTeam: () => setCreateTeamOpen(true),
      onNewMatch: () => setCreateMatchOpen(true),
      onNewBet: () => openCreateBet(),
      onNewEvent: () => setCreateEventOpen(true),
    });

    return () => onRegisterCreateActions?.({});
  }, [onRegisterCreateActions, openCreateBet]);

  const handleBetFromMatch = (match: Match, team: 1 | 2) => {
    openCreateBet(matchToBetSeed(match, team));
  };

  const handleNewEventSubmit = async (values: EventEditInput) => {
    await addEvent(values);
    setCreateEventOpen(false);
  };

  const handleCreateTeamSubmit = async (_teamId: string, values: TeamEditInput) => {
    const teamId = resolveTeamIdFromName(values.name);
    if (!teamId) return;
    await updateTeam(teamId, values);
    setCreateTeamOpen(false);
  };

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={reload} />;
  if (!profile) return null;

  return (
    <Container>
      <HomeTabs
        profile={profile}
        profiles={profiles}
        allBets={allBets}
        activeProfileId={profile.id}
        bets={bets}
        balance={profile.balance}
        matches={matches}
        onUpdateMatch={updateMatch}
        onSettleMatchBets={settleMatchBets}
        onDeleteMatch={deleteMatch}
        onBetMatch={handleBetFromMatch}
        onEdit={(bet) => {
          if (bet.status === "WAIT") setEditingBet(bet);
        }}
        onDelete={deleteBet}
        onWin={settleWin}
        onLose={settleLose}
        onRevert={revertToPending}
        events={events}
        onUpdateEvent={updateEvent}
        onDeleteEvent={deleteEvent}
        pickems={pickems}
        onAddPickemMajor={addPickemMajor}
        onConfigurePickemStages={configurePickemStages}
        onUploadPickemStageImage={uploadPickemStageImage}
        onDeletePickemMajor={deletePickemMajor}
        medals={medals}
        onUploadMedal={uploadMedal}
        onDeleteMedal={deleteMedal}
        teams={teams}
        rankingBaseline={rankingBaseline}
        onRefreshRankingBaseline={refreshRankingBaseline}
        onUpdateTeam={updateTeam}
        onSyncSportsRu={syncSportsRuMatches}
      />

      <MatchFormDialog
        open={createMatchOpen}
        bets={bets}
        events={events}
        onClose={() => setCreateMatchOpen(false)}
        onSubmit={async (values) => {
          await addMatch(values);
          setCreateMatchOpen(false);
        }}
      />

      <EventFormDialog
        open={createEventOpen}
        bets={bets}
        onClose={() => setCreateEventOpen(false)}
        onSubmit={handleNewEventSubmit}
      />

      <TeamFormDialog
        open={createTeamOpen}
        team={createTeamDraft}
        title="Новая команда"
        submitLabel="Добавить"
        onClose={() => setCreateTeamOpen(false)}
        onSubmit={handleCreateTeamSubmit}
      />

      <BetFormDialog
        open={createBetOpen}
        events={events}
        title={
          betSeed?.organization1 && betSeed?.organization2 ? "Ставка на матч" : "Новая ставка"
        }
        seed={betSeed}
        profileId={profile.id}
        balance={profile.balance}
        bets={bets}
        matches={matches}
        onClose={() => {
          setCreateBetOpen(false);
          setBetSeed(undefined);
        }}
        onSubmit={async (values) => {
          await addBet(values);
          setBetSeed(undefined);
        }}
      />

      <BetFormDialog
        open={Boolean(editingBet)}
        title="Редактировать ставку"
        profileId={profile.id}
        balance={profile.balance}
        bets={bets}
        events={events}
        initial={editingBet ?? undefined}
        onClose={() => setEditingBet(null)}
        onSubmit={async (values) => {
          if (!editingBet) return;
          await updateBet({ ...values, id: editingBet.id });
          setEditingBet(null);
        }}
      />

    </Container>
  );
};

export default HomePage;
