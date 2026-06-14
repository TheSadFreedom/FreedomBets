import type { Bet } from "@/entities/bet";
import type { EventTier } from "./constants";

export interface EventIdentity {
  id: string;
}

export interface EventEditInput {
  name: string;
  logoSlug: string | null;
  date: string;
  endDate: string;
  size: EventTier;
  winnerTeamId: string | null;
  prizePool: number | null;
  /** @deprecated legacy aliases */
  eventName?: string;
  /** @deprecated use size */
  eventTier?: EventTier;
  winnerOrganization?: string | null;
  winnerLogoSlug?: string | null;
}

export interface EventStats {
  id: string;
  name: string;
  logoSlug: string | null;
  date: string;
  endDate: string;
  size: EventTier;
  winnerTeamId: string | null;
  prizePool: number | null;
  totalBets: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
  profit: number;
  pendingExposure: number;
  bets: Bet[];
  /** @deprecated use size */
  eventTier?: EventTier;
  eventOrganization?: string;
  eventName?: string;
  winnerOrganization?: string | null;
  winnerLogoSlug?: string | null;
}
