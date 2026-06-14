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

/** Баланс = чистые пополнения + эффект всех ставок. */
export function calcProfileBalance(netDeposits: number, bets: Bet[]): number {
  return clampBalance(roundMoney(netDeposits + sumBetBalanceDelta(bets)));
}
