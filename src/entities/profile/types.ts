import type { ProfileMedal } from "@/entities/medal";

export type { ProfileMedal } from "@/entities/medal";

export type ProfileRole = "admin";

export interface Profile {
  id: number;
  name: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  medals: ProfileMedal[];
  /** Derived on load; not required in stored payload */
  totalBets?: number;
  winRate?: number;
  role?: ProfileRole;
}
