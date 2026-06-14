import type { EventTier } from "@/entities/event";

/** Размер турнира: Major, Big или Small */
export type TournamentSize = EventTier;

/** Турнир (коллекция `events` в SQLite). */
export interface Tournament {
  id: string;
  name: string;
  date: string;
  endDate: string;
  logoSlug: string | null;
  size: TournamentSize;
  winnerTeamId: string | null;
  prizePool: number | null;
  /** @deprecated legacy metadata kept for compatibility */
  eventTier?: TournamentSize;
  winnerOrganization?: string | null;
  winnerLogoSlug?: string | null;
  eventOrganization?: string;
  eventName?: string;
}

export type EventRecord = Tournament;

export type TournamentCreateInput = Pick<
  Tournament,
  "name" | "logoSlug" | "date" | "endDate" | "size" | "winnerTeamId" | "prizePool"
>;

export type EventRecordCreateInput = TournamentCreateInput;
