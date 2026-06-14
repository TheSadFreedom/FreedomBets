import type { ProfileMedal } from "@/entities/medal";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";

export function normalizeMedal(data: ProfileMedal): ProfileMedal {
  const legacy = data as ProfileMedal & { imageData?: string };
  const imageUrl =
    typeof legacy.imageUrl === "string" && legacy.imageUrl.trim()
      ? legacy.imageUrl.trim()
      : typeof legacy.imageData === "string" && legacy.imageData.trim()
        ? legacy.imageData.trim()
        : "";

  return {
    id: String(data.id),
    imageUrl,
    createdAt: data.createdAt?.trim() || todayIsoDateLocal(),
  };
}
