import type { Bet } from "@/entities/bet";

export interface TeamStats {
  name: string;
  totalBets: number;
}

export function calcTeamStatsList(bets: Bet[]): TeamStats[] {
  const counts = new Map<string, number>();

  for (const bet of bets) {
    const team1 = bet.organization1.trim();
    const team2 = bet.organization2.trim();
    if (team1) counts.set(team1, (counts.get(team1) ?? 0) + 1);
    if (team2) counts.set(team2, (counts.get(team2) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, totalBets]) => ({ name, totalBets }))
    .sort(
      (a, b) =>
        b.totalBets - a.totalBets || a.name.localeCompare(b.name, "ru")
    );
}
