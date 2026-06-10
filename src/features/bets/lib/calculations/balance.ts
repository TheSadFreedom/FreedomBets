import type { Bet } from "@/entities/bet";
import { clampBalance, roundMoney } from "@/shared/lib/limits";

/** Чистое изменение баланса от ставки (ставка списана, выплата учтена). */
export function betBalanceDelta(bet: Bet): number {
  if (bet.status === "WAIT") return -bet.amount;
  if (bet.status === "WIN") return bet.amount * bet.odds - bet.amount;
  return -bet.amount;
}

export function sumBetBalanceDelta(bets: Bet[]): number {
  return roundMoney(bets.reduce((sum, bet) => sum + betBalanceDelta(bet), 0));
}

export function calcProfileBalance(balanceBase: number, bets: Bet[]): number {
  return clampBalance(roundMoney(balanceBase + sumBetBalanceDelta(bets)));
}

export function resolveBalanceBase(
  storedBalance: number,
  balanceBase: number | undefined,
  bets: Bet[]
): number {
  if (balanceBase != null && Number.isFinite(balanceBase)) {
    return roundMoney(balanceBase);
  }
  return roundMoney(storedBalance - sumBetBalanceDelta(bets));
}

export function balanceBaseForTarget(targetBalance: number, bets: Bet[]): number {
  return roundMoney(targetBalance - sumBetBalanceDelta(bets));
}
