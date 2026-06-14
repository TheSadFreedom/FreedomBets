import type { BetMarket, BetStatus, MatchFormat } from "./constants";

export type BetTeamSide = 1 | 2;

/** Запись в БД */
export interface StoredBet {
  id: string;
  profileId: number;
  date: string;
  time: string;
  matchId: string;
  status: BetStatus;
  amount: number;
  odds: number;
  betType: string;
}

/** Обогащённая ставка для UI и расчёта (не хранится целиком в БД) */
export interface Bet extends StoredBet {
  format: MatchFormat;
  team1Id: string;
  team2Id: string;
  organization1: string;
  organization2: string;
  eventId: string;
  eventName: string;
  betMarket: BetMarket;
  betTeam: BetTeamSide;
  betTeamId: string | null;
  mapNumber: number | null;
  pistolRound: number | null;
  yesNo: boolean | null;
  exactScore1: number | null;
  exactScore2: number | null;
  /** @deprecated legacy UI field */
  eventOrganization?: string;
  /** @deprecated legacy UI field */
  majorStage?: string | null;
}
