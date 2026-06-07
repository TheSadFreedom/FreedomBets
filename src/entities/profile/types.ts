export type ProfileRole = "admin";

export interface Profile {
  id: number;
  name: string;
  balance: number;
  totalBets: number;
  winRate: number;
  role?: ProfileRole;
}
