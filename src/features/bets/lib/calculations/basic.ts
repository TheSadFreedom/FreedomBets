import type { Bet } from "@/entities/bet";

export function calcPendingExposure(bets: Bet[]): number {
  return bets
    .filter((b) => b.status === "WAIT")
    .reduce((sum, b) => sum + b.amount, 0);
}

export function calcSettledProfit(bets: Bet[]): number {
  return bets.reduce((acc, b) => {
    if (b.status === "WIN") return acc + b.amount * b.odds - b.amount;
    if (b.status === "LOSE") return acc - b.amount;
    return acc;
  }, 0);
}

export function calcWinRate(bets: Bet[]): number {
  const settled = getSettledBets(bets);
  if (settled.length === 0) return 0;
  const wins = settled.filter((b) => b.status === "WIN").length;
  return Math.round((wins / settled.length) * 100);
}

export function countByStatus(bets: Bet[], status: Bet["status"]): number {
  return bets.filter((b) => b.status === status).length;
}

export function getSettledBets(bets: Bet[]): Bet[] {
  return bets.filter((b) => b.status === "WIN" || b.status === "LOSE");
}

export function calcSettledWagered(bets: Bet[]): number {
  return getSettledBets(bets).reduce((sum, b) => sum + b.amount, 0);
}
