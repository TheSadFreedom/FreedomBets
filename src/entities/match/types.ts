import type { MatchFormat } from "@/entities/bet";

export const MATCH_STATUSES = ["scheduled", "live", "finished"] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export interface MatchMap {
  name: string;
  score1: number | null;
  score2: number | null;
}

export interface Match {
  id: string;
  eventId: string;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  format: MatchFormat;
  maps: MatchMap[];
  status: MatchStatus;
  sportsRuSeriesId?: string | null;
  sportsRuUrl?: string | null;
  /** @deprecated legacy UI fields */
  organization1?: string;
  /** @deprecated legacy UI fields */
  organization2?: string;
  /** @deprecated legacy UI fields */
  eventName?: string;
  /** @deprecated legacy UI fields */
  eventOrganization?: string;
  /** @deprecated legacy UI fields */
  majorStage?: string | null;
  /** @deprecated legacy scoreboard */
  score1?: number | null;
  /** @deprecated legacy scoreboard */
  score2?: number | null;
}

export type MatchFormValues = Omit<Match, "id">;

export type MatchCreateInput = Pick<
  Match,
  "eventId" | "team1Id" | "team2Id" | "date" | "time" | "format" | "maps"
>;
