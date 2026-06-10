import type { Bet } from "@/entities/bet";
import { betBalanceDelta } from "@/features/bets/lib/calculations/balance";
import { formatIsoDateDots, parseIsoDate, todayIsoDateLocal } from "@/shared/lib/date/isoDate";

export interface BalancePoint {
  date: string;
  time?: string;
  label: string;
  balance: number;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function addDaysIso(iso: string, delta: number): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  const date = new Date(parts.y, parts.m - 1, parts.d);
  date.setDate(date.getDate() + delta);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function* eachDayInclusive(from: string, to: string): Generator<string> {
  let current = from;
  while (current <= to) {
    yield current;
    if (current === to) return;
    current = addDaysIso(current, 1);
  }
}

function compareBetsChronologically(a: Bet, b: Bet): number {
  const byDate = a.date.localeCompare(b.date);
  if (byDate !== 0) return byDate;
  return a.time.localeCompare(b.time);
}

export { betBalanceDelta } from "@/features/bets/lib/calculations/balance";

/** Баланс на конец каждого календарного дня (все дни от первой ставки до сегодня). */
export function buildBalanceHistory(bets: Bet[], currentBalance: number): BalancePoint[] {
  const today = todayIsoDateLocal();

  if (bets.length === 0) {
    return [
      { date: addDaysIso(today, -1), label: formatIsoDateDots(addDaysIso(today, -1)), balance: currentBalance },
      { date: today, label: formatIsoDateDots(today), balance: currentBalance },
    ];
  }

  const sorted = [...bets].sort(compareBetsChronologically);
  const totalDelta = sorted.reduce((sum, bet) => sum + betBalanceDelta(bet), 0);
  const startBalance = currentBalance - totalDelta;

  const betsByDate = new Map<string, Bet[]>();
  for (const bet of sorted) {
    const list = betsByDate.get(bet.date) ?? [];
    list.push(bet);
    betsByDate.set(bet.date, list);
  }

  const firstDate = sorted[0].date;
  const endDate = today >= firstDate ? today : firstDate;

  const points: BalancePoint[] = [
    {
      date: addDaysIso(firstDate, -1),
      label: "Старт",
      balance: startBalance,
    },
  ];

  let running = startBalance;
  for (const date of eachDayInclusive(firstDate, endDate)) {
    const dayBets = betsByDate.get(date) ?? [];
    for (const bet of dayBets) {
      running += betBalanceDelta(bet);
    }
    points.push({
      date,
      label: formatIsoDateDots(date),
      balance: running,
    });
  }

  const last = points[points.length - 1];
  if (last && Math.abs(last.balance - currentBalance) > 0.01) {
    last.balance = currentBalance;
    if (last.date === today) {
      last.label = formatIsoDateDots(today);
    }
  }

  return points;
}
