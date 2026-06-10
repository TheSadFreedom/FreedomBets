import type { MatchFormat } from "@/entities/bet";
export const MATCH_STATUSES = ["scheduled", "live", "finished"] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

/** Результат одной карты: название и счёт раундов */
export interface MatchMap {
  name: string;
  score1: number | null;
  score2: number | null;
}

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
  /** BO1 — 1 карта, BO3 — 3, BO5 — 5 */
  maps: MatchMap[];
  status: MatchStatus;
  /** @deprecated Старые записи; серия считается из maps */
  score1?: number | null;
  /** @deprecated Старые записи; серия считается из maps */
  score2?: number | null;
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
  | "maps"
>;
