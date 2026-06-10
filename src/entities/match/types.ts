import type { MatchFormat } from "@/entities/bet";
export const MATCH_STATUSES = ["scheduled", "live", "finished"] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export interface Match {
  id: string;
  date: string;
  time: string;
  format: MatchFormat;
  organization1: string;
  organization2: string;
  eventOrganization: string;
  eventName: string;
  majorStage: string | null;
  /** Выигранные карты; null — счёт не указан */
  score1: number | null;
  score2: number | null;
  status: MatchStatus;
}

export type MatchFormValues = Omit<Match, "id">;

export type MatchCreateInput = Pick<
  Match,
  | "date"
  | "time"
  | "format"
  | "organization1"
  | "organization2"
  | "eventOrganization"
  | "eventName"
  | "majorStage"
  | "score1"
  | "score2"
>;
