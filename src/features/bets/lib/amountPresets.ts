export const BET_AMOUNT_PERCENT_PRESETS = [3, 5, 7, 10, 15, 20, 30] as const;

export function betAmountFromBalancePercent(balance: number, percent: number): number {
  if (balance <= 0) return 1;
  return Math.max(1, Math.round((balance * percent) / 100));
}
