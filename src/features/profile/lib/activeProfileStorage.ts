const ACTIVE_PROFILE_ID_KEY = "freedombets.activeProfileId";

import { parseProfileId } from "./profileId";

export function readActiveProfileId(): number | null {
  const raw = localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
  if (!raw) return null;
  return parseProfileId(raw);
}

export function writeActiveProfileId(id: number) {
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, String(id));
}

export function clearActiveProfileId() {
  localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
}
