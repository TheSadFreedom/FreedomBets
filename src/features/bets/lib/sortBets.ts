import type { Bet } from "@/entities/bet";
import { normalizeTimeInput } from "@/shared/lib/time/parseTimeInput";

export type BetDateTimeSortDirection = "asc" | "desc";

export function betDateTimeSortKey(bet: Pick<Bet, "date" | "time">): string {
  return `${bet.date}T${normalizeTimeInput(bet.time)}`;
}

export function compareBetsByDateTime(
  a: Bet,
  b: Bet,
  direction: BetDateTimeSortDirection = "desc"
): number {
  const cmp = betDateTimeSortKey(a).localeCompare(betDateTimeSortKey(b));
  return direction === "desc" ? -cmp : cmp;
}

export function sortBetsByDateTime(
  bets: Bet[],
  direction: BetDateTimeSortDirection = "desc"
): Bet[] {
  return [...bets].sort((a, b) => compareBetsByDateTime(a, b, direction));
}

export function compareBetsByDateTimeDesc(a: Bet, b: Bet): number {
  return compareBetsByDateTime(a, b, "desc");
}

export function sortBetsByDateTimeDesc(bets: Bet[]): Bet[] {
  return sortBetsByDateTime(bets, "desc");
}
