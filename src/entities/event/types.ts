import type { Bet } from "@/entities/bet";
import type { EventTier } from "./constants";
export interface EventIdentity {
  eventOrganization: string;
  eventName: string;
  majorStage?: string | null;
  /** Все стадии турнира (без фильтра по стадии) */
  allMajorStages?: boolean;
}

export interface EventEditInput {
  eventOrganization: string;
  eventName: string;
  logoSlug: string | null;
  date: string;
  endDate: string;
  eventTier: EventTier;
  majorStage: string | null;
  stages: string[];
  winnerOrganization: string | null;
  winnerLogoSlug: string | null;
  /** Призовой фонд турнира, USD */
  prizePool: number | null;
}

export interface EventStats extends EventIdentity {
  logoSlug: string | null;
  /** Дата начала турнира или последней ставки */
  date: string;
  /** Дата окончания турнира (из сохранённой записи) */
  endDate: string;
  eventTier: EventTier;
  majorStage: string | null;
  stages: string[];
  winnerOrganization: string | null;
  winnerLogoSlug: string | null;
  prizePool: number | null;
  totalBets: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
  profit: number;
  pendingExposure: number;
  bets: Bet[];
}
