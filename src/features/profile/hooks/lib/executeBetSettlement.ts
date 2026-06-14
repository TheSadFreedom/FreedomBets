import type { Bet } from "@/entities/bet";
import type { BetSettlementPlan } from "@/features/matches/lib/settleBetsForMatch";
import { normalizeBet } from "@/features/profile/lib/normalizeBet";
import { httpClient } from "@/shared/api/httpClient";

export async function executeBetSettlementPlan(plan: BetSettlementPlan[]): Promise<Bet[]> {
  if (plan.length === 0) return [];

  return Promise.all(
    plan.map(async ({ bet, nextStatus }) => {
      const res = await httpClient.patch<Bet>(`/bets/${bet.id}`, { status: nextStatus });
      return normalizeBet(res.data, bet);
    }),
  );
}

export function mergeSavedBets(betsSource: Bet[], savedBets: Bet[]): Bet[] {
  const savedById = new Map(savedBets.map((item) => [item.id, item]));
  return betsSource.map((item) => savedById.get(item.id) ?? item);
}
