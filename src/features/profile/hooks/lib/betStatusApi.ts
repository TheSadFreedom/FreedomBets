import type { Bet, StoredBet } from "@/entities/bet";
import { normalizeStoredBet } from "@/features/profile/lib/normalizeBet";
import { httpClient } from "@/shared/api/httpClient";

export async function patchBetStatus(
  id: string,
  status: Bet["status"],
  previous: Bet,
): Promise<Bet> {
  const res = await httpClient.patch<StoredBet>(`/bets/${id}`, { status });
  const stored = normalizeStoredBet(res.data);
  return { ...previous, status: stored.status };
}

export function replaceBetInLists(
  bets: Bet[],
  allBets: Bet[],
  saved: Bet,
): { nextBets: Bet[]; nextAllBets: Bet[] } {
  return {
    nextBets: bets.map((item) => (item.id === saved.id ? saved : item)),
    nextAllBets: allBets.map((item) => (item.id === saved.id ? saved : item)),
  };
}
