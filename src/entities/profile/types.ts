export type ProfileRole = "admin";

export interface Profile {
  id: number;
  name: string;
  balance: number;
  /** Пополнения/выводы вне ставок; баланс = balanceBase + дельты ставок */
  balanceBase?: number;
  totalBets: number;
  winRate: number;
  role?: ProfileRole;
}
