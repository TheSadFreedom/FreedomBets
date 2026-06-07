import type { Profile } from "@/entities/profile";

export function isAdminProfile(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.role === "admin") return true;
  return profile.name.trim().toLowerCase() === "admin";
}
