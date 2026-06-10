import type { BetMarket, BetStatus, MatchFormat } from "./constants";

export type BetTeamSide = 1 | 2;

export interface Bet {
  id: string;
  /** Явная связь с матчем (надёжнее сопоставления по дате и командам) */
  matchId?: string | null;
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
  /** Да/нет для рынка «возьмёт хотя бы одну карту»; null вне этого рынка */
  yesNo: boolean | null;
  /** Карты команды 1 в ставке на точный счёт BO3; null вне этого рынка */
  exactScore1: number | null;
  /** Карты команды 2 в ставке на точный счёт BO3; null вне этого рынка */
  exactScore2: number | null;
  /** Человекочитаемое описание (дублирует структуру для API и истории) */
  betType: string;
  amount: number;
  odds: number;
  eventOrganization: string;
  eventName: string;
  /** Стадия турнира; null если турнир без стадий */
  majorStage: string | null;
  status: BetStatus;
}
