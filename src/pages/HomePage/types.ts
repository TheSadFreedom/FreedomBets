import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { MatchSettlementResult } from "@/features/matches/lib/settleBetsForMatch";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor, PickemStageName } from "@/entities/pickem";
import type { Profile } from "@/entities/profile";

export interface ProfileBetsState {
  profile: Profile | null;
  profiles: Profile[];
  bets: Bet[];
  allBets: Bet[];
  matches: Match[];
  pickems: PickemMajor[];
  medals: ProfileMedal[];
  events: EventRecord[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  selectProfile: (id: number) => void;
  createProfile: (name: string) => Promise<void>;
  exitProfile: () => void;
  addBet: (data: Omit<Bet, "id">) => Promise<void>;
  updateBet: (updated: Bet, previous: Bet) => Promise<void>;
  deleteBet: (bet: Bet) => Promise<void>;
  settleWin: (id: string) => Promise<void>;
  settleLose: (id: string) => Promise<void>;
  revertToPending: (id: string) => Promise<void>;
  setBalance: (balance: number) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  deleteProfile: () => Promise<void>;
  addMatch: (data: MatchCreateInput) => Promise<void>;
  updateMatch: (match: Match, data: MatchCreateInput) => Promise<void>;
  syncSportsRuMatches: (force?: boolean) => Promise<void>;
  settleMatchBets: (match: Match) => Promise<MatchSettlementResult>;
  deleteMatch: (match: Match) => Promise<void>;
  updateEvent: (identity: EventIdentity, data: EventEditInput) => Promise<void>;
  deleteEvent: (identity: EventIdentity) => Promise<void>;
  addEvent: (data: EventEditInput) => Promise<void>;
  addPickemMajor: (eventOrganization: string, eventName: string) => Promise<void>;
  uploadPickemStageImage: (
    major: PickemMajor,
    stage: PickemStageName,
    file: File
  ) => Promise<void>;
  deletePickemMajor: (major: PickemMajor) => Promise<void>;
  uploadMedal: (imageData: string) => Promise<void>;
  deleteMedal: (medal: ProfileMedal) => Promise<void>;
}
