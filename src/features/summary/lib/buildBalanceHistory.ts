import type { Bet } from "@/entities/bet";
import { formatIsoDateTimeDots, todayIsoDateLocal } from "@/shared/lib/date/isoDate";

export interface BalancePoint {
  date: string;
  time?: string;
  label: string;
  balance: number;
}

function compareBetsChronologically(a: Bet, b: Bet): number {
  const byDate = a.date.localeCompare(b.date);
  if (byDate !== 0) return byDate;
  return a.time.localeCompare(b.time);
}

/** Чистое изменение баланса от ставки (ставка списана, выплата учтена). */
export function betBalanceDelta(bet: Bet): number {
  if (bet.status === "WAIT") return -bet.amount;
  if (bet.status === "WIN") return bet.amount * bet.odds - bet.amount;
  return -bet.amount;
}

export function buildBalanceHistory(bets: Bet[], currentBalance: number): BalancePoint[] {
  const today = todayIsoDateLocal();

  if (bets.length === 0) {
    return [{ date: today, label: "Сейчас", balance: currentBalance }];
  }

  const sorted = [...bets].sort(compareBetsChronologically);
  const totalDelta = sorted.reduce((sum, bet) => sum + betBalanceDelta(bet), 0);
  const startBalance = currentBalance - totalDelta;

  const points: BalancePoint[] = [
    {
      date: sorted[0].date,
      time: sorted[0].time,
      label: "Старт",
      balance: startBalance,
    },
  ];

  let running = startBalance;
  for (const bet of sorted) {
    running += betBalanceDelta(bet);
    points.push({
      date: bet.date,
      time: bet.time,
      label: formatIsoDateTimeDots(bet.date, bet.time),
      balance: running,
    });
  }

  const last = points[points.length - 1];
  if (last.date !== today || Math.abs(last.balance - currentBalance) > 0.01) {
    points.push({
      date: today,
      label: "Сейчас",
      balance: currentBalance,
    });
  }

  return points;
}
