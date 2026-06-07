import type { EventTier, MajorStage } from "@/entities/event";
import type { BetMarket, BetStatus, MatchFormat } from "./constants";

export type BetTeamSide = 1 | 2;

export interface Bet {
  id: string;
  profileId: number;
  date: string;
  time: string;
  format: MatchFormat;
  organization1: string;
  organization2: string;
  betMarket: BetMarket;
  betTeam: BetTeamSide;
  /** Номер карты (1…N по формату); null для ставки на матч */
  mapNumber: number | null;
  /** Номер пистолетного раунда на карте (1 или 2); null вне рынка «пистолет» */
  pistolRound: 1 | 2 | null;
  /** Человекочитаемое описание (дублирует структуру для API и истории) */
  betType: string;
  amount: number;
  odds: number;
  eventOrganization: string;
  eventName: string;
  eventTier: EventTier;
  /** Стадия major-турнира; null для Big/Small */
  majorStage: MajorStage | null;
  status: BetStatus;
}
