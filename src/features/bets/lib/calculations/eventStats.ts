import type { Bet } from "@/entities/bet";
import type { EventStats, MajorStage } from "@/entities/event";
import { eventStatsKey } from "@/features/events/lib/eventDisplay";
import {
  calcPendingExposure,
  calcSettledProfit,
  calcWinRate,
  countByStatus,
} from "./basic";
import { compareBetsByDateTimeDesc } from "../sortBets";

export function calcEventStatsList(bets: Bet[]): EventStats[] {
  const byEvent = new Map<string, Bet[]>();

  for (const bet of bets) {
    const org = bet.eventOrganization.trim() || "Без организации";
    const name = bet.eventName.trim();
    const stage = bet.eventTier === "Major" ? bet.majorStage : null;
    const key = eventStatsKey(org, name, stage);
    const group = byEvent.get(key) ?? [];
    group.push(bet);
    byEvent.set(key, group);
  }

  return Array.from(byEvent.entries()).map(([key, eventBets]) => {
    const parts = key.split("\0");
    const eventOrganization = parts[0] ?? "";
    const eventName = parts[1] ?? "";
    const majorStage = (parts[2] as MajorStage | undefined) ?? null;
    const sortedBets = [...eventBets].sort(compareBetsByDateTimeDesc);

    const latest = sortedBets[0];

    return {
      eventOrganization,
      eventName,
      majorStage,
      date: latest.date,
      endDate: "",
      eventTier: latest.eventTier,
      totalBets: sortedBets.length,
      wins: countByStatus(sortedBets, "WIN"),
      losses: countByStatus(sortedBets, "LOSE"),
      pending: countByStatus(sortedBets, "WAIT"),
      winRate: calcWinRate(sortedBets),
      profit: calcSettledProfit(sortedBets),
      pendingExposure: calcPendingExposure(sortedBets),
      bets: sortedBets,
    };
  });
}
