import type { Bet } from "@/entities/bet";
import {
  calcPendingExposure,
  calcSettledProfit,
  calcSettledWagered,
  calcWinRate,
  countByStatus,
  getSettledBets,
} from "./basic";
import { FORMAT_WIN_RATE_BUCKETS, calcWinRateByFormat } from "./formatBuckets";
import { ODDS_WIN_RATE_BUCKETS, calcWinRateInOddsRange } from "./oddsBuckets";

export interface SummaryStats {
  settledCount: number;
  settledWagered: number;
  pendingCount: number;
  pendingWagered: number;
  profit: number;
  winRate: number;
  wins: number;
  losses: number;
  oddsWinRates: Array<{
    id: string;
    label: string;
    winRate: number | null;
    settled: number;
    wins: number;
    losses: number;
    pending: number;
  }>;
  formatWinRates: Array<{
    id: string;
    label: string;
    winRate: number | null;
    settled: number;
    wins: number;
    losses: number;
    pending: number;
  }>;
}

export function calcSummaryStats(bets: Bet[]): SummaryStats {
  const settled = getSettledBets(bets);
  return {
    settledCount: settled.length,
    settledWagered: calcSettledWagered(bets),
    pendingCount: countByStatus(bets, "WAIT"),
    pendingWagered: calcPendingExposure(bets),
    profit: calcSettledProfit(bets),
    winRate: calcWinRate(bets),
    wins: countByStatus(bets, "WIN"),
    losses: countByStatus(bets, "LOSE"),
    oddsWinRates: ODDS_WIN_RATE_BUCKETS.map((bucket) => {
      const result = calcWinRateInOddsRange(bets, bucket.min, bucket.max);
      return {
        id: bucket.id,
        label: bucket.label,
        ...result,
      };
    }),
    formatWinRates: FORMAT_WIN_RATE_BUCKETS.map((bucket) => {
      const result = calcWinRateByFormat(bets, bucket.id);
      return {
        id: bucket.id,
        label: bucket.label,
        ...result,
      };
    }),
  };
}
