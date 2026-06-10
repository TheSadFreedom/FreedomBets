import type { Bet } from "@/entities/bet";
import { MATCH_FORMATS, type MatchFormat } from "@/entities/bet/constants";
import { calcWinRateBucket, type WinRateBucketResult } from "./basic";

export const FORMAT_WIN_RATE_BUCKETS = MATCH_FORMATS.map((format) => ({
  id: format,
  label: format,
}));

export function calcWinRateByFormat(
  bets: Bet[],
  format: MatchFormat
): WinRateBucketResult {
  return calcWinRateBucket(bets.filter((b) => b.format === format));
}
