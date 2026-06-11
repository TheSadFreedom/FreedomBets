import type { Profile } from "@/entities/profile";

export function profilePatchPayload(profile: Profile) {
  return {
    name: profile.name,
    balance: profile.balance,
    balanceBase: profile.balanceBase,
    totalBets: profile.totalBets,
    winRate: profile.winRate,
  };
}
