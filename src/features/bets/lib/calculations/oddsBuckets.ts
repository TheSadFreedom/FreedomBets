import type { Bet } from "@/entities/bet";
import { calcWinRateBucket, type WinRateBucketResult } from "./basic";

export const ODDS_WIN_RATE_BUCKETS = [
  { id: "1.00-1.25", label: "1.00 – 1.25", min: 1, max: 1.25 },
  { id: "1.26-1.50", label: "1.26 – 1.50", min: 1.26, max: 1.5 },
  { id: "1.51-1.75", label: "1.51 – 1.75", min: 1.51, max: 1.75 },
  { id: "1.76-2.00", label: "1.76 – 2.00", min: 1.76, max: 2 },
  { id: "2.00+", label: "от 2.00", min: 2, max: Infinity },
] as const;

export function calcWinRateInOddsRange(
  bets: Bet[],
  min: number,
  max: number
): WinRateBucketResult {
  return calcWinRateBucket(bets.filter((b) => b.odds >= min && b.odds <= max));
}
