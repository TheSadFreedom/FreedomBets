export const BET_AMOUNT_PERCENT_PRESETS = [1, 3, 5, 7, 10, 15, 20, 30, 50, 100] as const;

import { clampBetAmount } from "@/shared/lib/limits";

export function betAmountFromBalancePercent(balance: number, percent: number): number {
  if (balance <= 0) return 1;
  return clampBetAmount(Math.max(1, Math.round((balance * percent) / 100)));
}
