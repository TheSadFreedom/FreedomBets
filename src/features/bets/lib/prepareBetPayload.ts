import type { Bet, StoredBet } from "@/entities/bet";
import { toStoredBet } from "@/shared/lib/db/enrichBet";

/** Сохраняем в БД только StoredBet-поля. */
export function prepareBetPayload(data: Omit<Bet, "id">): Omit<StoredBet, "id"> {
  const stored = toStoredBet({ ...data, id: "new" });
  return {
    profileId: stored.profileId,
    date: stored.date,
    time: stored.time,
    matchId: stored.matchId,
    status: stored.status,
    amount: stored.amount,
    odds: stored.odds,
    betType: stored.betType,
  };
}
