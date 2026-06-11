import type { Bet } from "@/entities/bet";
import { normalizeBet } from "@/features/profile/lib/normalizeBet";
import { httpClient } from "@/shared/api/httpClient";

export async function patchBetStatus(id: string, status: Bet["status"]): Promise<Bet> {
  const res = await httpClient.patch<Bet>(`/bets/${id}`, { status });
  return normalizeBet(res.data);
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

export async function patchBetMajorStage(
  bet: Bet,
  majorStage: string | null,
): Promise<Bet> {
  const res = await httpClient.patch<Bet>(`/bets/${bet.id}`, { majorStage });
  return normalizeBet(res.data);
}
