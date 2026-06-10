import type { Bet } from "@/entities/bet";
import type { Profile } from "@/entities/profile";
import {
  calcProfileBalance,
  calcWinRate,
  resolveBalanceBase,
} from "@/features/bets/lib/calculations";

export function betsForProfile(bets: Bet[], profileId: number): Bet[] {
  return bets.filter((bet) => bet.profileId === profileId);
}

export function enrichProfileWithBets(profile: Profile, bets: Bet[]): Profile {
  const profileBets = betsForProfile(bets, profile.id);
  const balanceBase = resolveBalanceBase(profile.balance, profile.balanceBase, profileBets);

  return {
    ...profile,
    balanceBase,
    balance: calcProfileBalance(balanceBase, profileBets),
    totalBets: profileBets.length,
    winRate: calcWinRate(profileBets),
  };
}

export function enrichProfilesWithBets(profiles: Profile[], allBets: Bet[]): Profile[] {
  return profiles.map((profile) => enrichProfileWithBets(profile, allBets));
}

export function profileNeedsBalanceSync(profile: Profile, bets: Bet[]): boolean {
  const enriched = enrichProfileWithBets(profile, bets);
  return (
    profile.balance !== enriched.balance ||
    profile.balanceBase !== enriched.balanceBase ||
    profile.totalBets !== enriched.totalBets ||
    profile.winRate !== enriched.winRate
  );
}
