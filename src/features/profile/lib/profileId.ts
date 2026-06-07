import type { Profile } from "@/entities/profile";

export function parseProfileId(value: unknown): number | null {
  const id = Number(value);
  if (!Number.isFinite(id) || id <= 0) return null;
  return id;
}

export function getNextProfileId(profiles: Profile[]): number {
  const maxId = profiles.reduce((max, profile) => {
    const id = parseProfileId(profile.id);
    return id == null ? max : Math.max(max, id);
  }, 0);
  return maxId + 1;
}
