import type { StoredBet } from "@/entities/bet";
import { normalizeBetStatus } from "@/entities/bet";
import { clampBetAmount } from "@/shared/lib/limits";

export type BetFromApi = Partial<StoredBet> & {
  id: string | number;
  profileId: number | string;
};

export function normalizeStoredBet(data: BetFromApi): StoredBet {
  return {
    id: String(data.id),
    profileId: Number(data.profileId),
    date: String(data.date ?? "").trim(),
    time: String(data.time ?? "").trim(),
    matchId: String(data.matchId ?? "").trim(),
    status: normalizeBetStatus(String(data.status ?? "WAIT")),
    amount: clampBetAmount(Number(data.amount)),
    odds: Number(data.odds) || 0,
    betType: String(data.betType ?? "").trim(),
  };
}

/** @deprecated use normalizeStoredBet + enrichBet */
export function normalizeBet(data: BetFromApi): StoredBet {
  return normalizeStoredBet(data);
}
