import type { Profile } from "@/entities/profile";
import { parseProfileId } from "./profileId";

export function normalizeProfile(data: Profile): Profile {
  const id = parseProfileId(data.id);
  if (id == null) {
    throw new Error(`Invalid profile id: ${String(data.id)}`);
  }
  return {
    ...data,
    id,
    role: data.role === "admin" ? "admin" : undefined,
  };
}
