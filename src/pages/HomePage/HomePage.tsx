import { useState } from "react";
import type { Bet } from "@/entities/bet";
import type { EventEditInput } from "@/entities/event";
import type { Match } from "@/entities/match";
import BetFormDialog, {
  type BetFormSeed,
} from "@/features/bets/components/BetFormDialog/BetFormDialog";
import EventFormDialog from "@/features/events/components/EventFormDialog/EventFormDialog";
import HomeQuickActions from "@/features/home/components/HomeQuickActions/HomeQuickActions";
import HomeTabs from "@/features/home/components/HomeTabs/HomeTabs";
import MatchFormDialog from "@/features/matches/components/MatchFormDialog/MatchFormDialog";
import { isAdminProfile } from "@/features/profile/lib/isAdminProfile";
import { matchToBetSeed } from "@/features/matches/lib/matchToBetSeed";
import PageError from "@/shared/ui/PageError/PageError";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";
import type { ProfileBetsState } from "./types";
import { Container } from "./HomePage.styled";

interface HomePageProps {
  profileBets: ProfileBetsState;
}

const HomePage = ({ profileBets }: HomePageProps) => {
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
    settleMatchBets,
    deleteMatch,
    addEvent,
    updateEvent,
    events,
    pickems,
    addPickemMajor,
    uploadPickemStageImage,
    deletePickemMajor,
    medals,
    uploadMedal,
    deleteMedal,
  } = profileBets;

  const [createBetOpen, setCreateBetOpen] = useState(false);
  const [createMatchOpen, setCreateMatchOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [editingBet, setEditingBet] = useState<Bet | null>(null);
  const [betSeed, setBetSeed] = useState<BetFormSeed | undefined>();

  const openCreateBet = (seed?: BetFormSeed) => {
    setBetSeed(seed);
    setCreateBetOpen(true);
  };

  const handleBetFromMatch = (match: Match, team: 1 | 2) => {
    openCreateBet(matchToBetSeed(match, team));
  };

  const handleNewEventSubmit = async (values: EventEditInput) => {
    await addEvent(values);
    setCreateEventOpen(false);
  };

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={reload} />;
  if (!profile) return null;

  const isAdmin = isAdminProfile(profile);

  return (
    <Container>
      {isAdmin ? (
        <HomeQuickActions
          onNewMatch={() => setCreateMatchOpen(true)}
          onNewEvent={() => setCreateEventOpen(true)}
        />
      ) : null}

      <HomeTabs
        isAdmin={isAdmin}
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
        pickems={pickems}
        onAddPickemMajor={addPickemMajor}
        onUploadPickemStageImage={uploadPickemStageImage}
        onDeletePickemMajor={deletePickemMajor}
        medals={medals}
        onUploadMedal={uploadMedal}
        onDeleteMedal={deleteMedal}
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
          await updateBet({ ...values, id: editingBet.id }, editingBet);
          setEditingBet(null);
        }}
      />
    </Container>
  );
};

export default HomePage;
