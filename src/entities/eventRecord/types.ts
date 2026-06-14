import type { EventTier } from "@/entities/event";

export interface EventRecord {
  id: string;
  eventOrganization: string;
  eventName: string;
  /** Имя файла без расширения из public/events */
  logoSlug: string | null;
  date: string;
  endDate: string;
  eventTier: EventTier;
  /** Стадии турнира; пустой массив — без деления на стадии */
  stages: string[];
  /** Победитель турнира (команда) */
  winnerOrganization: string | null;
  /** Slug файла логотипа победителя из public/teams */
  winnerLogoSlug: string | null;
  /** Призовой фонд турнира, USD */
  prizePool: number | null;
}

export type EventRecordCreateInput = Pick<
  EventRecord,
  | "eventOrganization"
  | "eventName"
  | "logoSlug"
  | "date"
  | "endDate"
  | "eventTier"
  | "stages"
  | "winnerOrganization"
  | "winnerLogoSlug"
  | "prizePool"
>;
