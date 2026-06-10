import type { Bet } from "@/entities/bet";
import type { Profile } from "@/entities/profile";
import { calcSettledProfit, calcWinRate } from "@/features/bets/lib/calculations";

export interface ProfileRankingRow {
  profileId: number;
  name: string;
  totalBets: number;
  winRate: number;
  profit: number;
}

export function buildProfileRankings(
  profiles: Profile[],
  allBets: Bet[]
): ProfileRankingRow[] {
  const betsByProfile = new Map<number, Bet[]>();

  for (const bet of allBets) {
    const list = betsByProfile.get(bet.profileId) ?? [];
    list.push(bet);
    betsByProfile.set(bet.profileId, list);
  }

  return profiles
    .map((profile) => {
      const profileBets = betsByProfile.get(profile.id) ?? [];
      return {
        profileId: profile.id,
        name: profile.name,
        totalBets: profileBets.length,
        winRate: calcWinRate(profileBets),
        profit: calcSettledProfit(profileBets),
      };
    })
    .sort((a, b) => b.profit - a.profit || a.name.localeCompare(b.name, "ru"));
}
