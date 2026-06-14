export type ProfileRole = "admin";

export interface Profile {
  id: number;
  name: string;
  balance: number;
  /** Пополнения/выводы вне ставок; баланс = balanceBase + дельты ставок */
  balanceBase?: number;
  /** Сумма всех пополнений баланса */
  totalDeposited?: number;
  /** Сумма всех выводов с баланса */
  totalWithdrawn?: number;
  totalBets: number;
  winRate: number;
  role?: ProfileRole;
}
