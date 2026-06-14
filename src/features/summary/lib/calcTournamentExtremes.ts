import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import {
  calcSettledProfit,
  calcWinRate,
  countByStatus,
  getSettledBets,
} from "@/features/bets/lib/calculations";
import {
  eventStatsKey,
  formatEventLabel,
  resolveEventLogoSlug,
} from "@/features/events/lib/eventDisplay";

export interface TournamentStatsSummary {
  key: string;
  eventOrganization: string;
  eventName: string;
  logoSlug: string | null;
  label: string;
  profit: number;
  winRate: number;
  wins: number;
  losses: number;
  pending: number;
  settledCount: number;
  totalBets: number;
}

function tournamentKey(bet: Bet): string {
  return eventStatsKey(bet.eventId, bet.eventName);
}

export function calcTournamentStatsGrouped(
  bets: Bet[],
  events: EventRecord[] = [],
): TournamentStatsSummary[] {
  const byTournament = new Map<string, Bet[]>();

  for (const bet of bets) {
    const key = tournamentKey(bet);
    const group = byTournament.get(key) ?? [];
    group.push(bet);
    byTournament.set(key, group);
  }

  return Array.from(byTournament.entries()).map(([key, tournamentBets]) => {
    const parts = key.split("\0");
    const eventId = parts[0] ?? "";
    const eventName = parts[1] ?? "";
    const settled = getSettledBets(tournamentBets);

    return {
      key,
      eventOrganization: eventName,
      eventName,
      logoSlug: resolveEventLogoSlug(eventId, eventName, events),
      label: formatEventLabel("", eventName),
      profit: calcSettledProfit(tournamentBets),
      winRate: calcWinRate(tournamentBets),
      wins: countByStatus(tournamentBets, "WIN"),
      losses: countByStatus(tournamentBets, "LOSE"),
      pending: countByStatus(tournamentBets, "WAIT"),
      settledCount: settled.length,
      totalBets: tournamentBets.length,
    };
  });
}

function compareTournamentProfit(a: TournamentStatsSummary, b: TournamentStatsSummary): number {
  if (b.profit !== a.profit) return b.profit - a.profit;
  if (b.winRate !== a.winRate) return b.winRate - a.winRate;
  return a.label.localeCompare(b.label, "ru");
}

export function pickTournamentExtremes(items: TournamentStatsSummary[]): {
  best: TournamentStatsSummary | null;
  worst: TournamentStatsSummary | null;
} {
  const eligible = items.filter((item) => item.settledCount > 0);
  if (eligible.length === 0) {
    return { best: null, worst: null };
  }

  const sorted = [...eligible].sort(compareTournamentProfit);
  return {
    best: sorted[0] ?? null,
    worst: sorted[sorted.length - 1] ?? null,
  };
}

export function calcTournamentExtremes(bets: Bet[], events: EventRecord[] = []) {
  const grouped = calcTournamentStatsGrouped(bets, events);
  return pickTournamentExtremes(grouped);
}
