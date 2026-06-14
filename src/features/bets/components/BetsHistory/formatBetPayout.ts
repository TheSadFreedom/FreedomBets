import type { Bet } from "@/entities/bet";

export function formatBetPayout(bet: Bet): string {
  if (bet.status === "WAIT") {
    return `${bet.amount.toLocaleString("ru-RU")} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
}
