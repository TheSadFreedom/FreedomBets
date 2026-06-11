import type { Profile } from "@/entities/profile";
import { normalizeProfile } from "@/features/profile/lib/normalizeProfile";

export function normalizeProfileList(raw: Profile[]): Profile[] {
  return raw
    .map((item) => {
      try {
        return normalizeProfile(item);
      } catch (err) {
        console.error(err);
        return null;
      }
    })
    .filter((item): item is Profile => item != null);
}
