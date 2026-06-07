import type { ProfileMedal } from "@/entities/medal";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";

export function normalizeMedal(data: ProfileMedal): ProfileMedal {
  const profileId = Number(data.profileId);
  return {
    ...data,
    id: String(data.id),
    profileId: Number.isFinite(profileId) ? profileId : 0,
    imageData: typeof data.imageData === "string" ? data.imageData : "",
    createdAt: data.createdAt?.trim() || todayIsoDateLocal(),
  };
}
