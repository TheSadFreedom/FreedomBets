import type { Bet } from "@/entities/bet";
import type { EventTier } from "./constants";
import type { MajorStage } from "./majorStage";

export interface EventIdentity {
  eventOrganization: string;
  eventName: string;
  majorStage?: MajorStage | null;
  /** Все стадии major-турнира (без фильтра по стадии) */
  allMajorStages?: boolean;
}

export interface EventEditInput {
  eventOrganization: string;
  eventName: string;
  date: string;
  endDate: string;
  eventTier: EventTier;
  majorStage: MajorStage | null;
}

export interface EventStats extends EventIdentity {
  /** Дата начала турнира или последней ставки */
  date: string;
  /** Дата окончания турнира (из сохранённой записи) */
  endDate: string;
  eventTier: EventTier;
  majorStage: MajorStage | null;
  totalBets: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
  profit: number;
  pendingExposure: number;
  bets: Bet[];
}
