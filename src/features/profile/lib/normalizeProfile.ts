import type { Profile, ProfileMedal } from "@/entities/profile";
import { clampBalance, limitInputLength } from "@/shared/lib/limits";
import { resolveBalanceTotals } from "./profileBalance";
import { parseProfileId } from "./profileId";

function normalizeMedals(raw: unknown): ProfileMedal[] {
  if (!Array.isArray(raw)) return [];
  const result: ProfileMedal[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const medal = item as Partial<ProfileMedal> & { imageData?: unknown };
    const imageUrl =
      typeof medal.imageUrl === "string" && medal.imageUrl.trim()
        ? medal.imageUrl.trim()
        : typeof medal.imageData === "string" && medal.imageData.trim()
          ? medal.imageData.trim()
          : "";
    if (!imageUrl) continue;
    result.push({
      id: String(medal.id ?? crypto.randomUUID()),
      imageUrl,
      createdAt: typeof medal.createdAt === "string" ? medal.createdAt : undefined,
    });
  }
  return result;
}

export function normalizeProfile(data: Profile): Profile {
  const id = parseProfileId(data.id);
  if (id == null) {
    throw new Error(`Invalid profile id: ${String(data.id)}`);
  }
  const { totalDeposited, totalWithdrawn } = resolveBalanceTotals({
    ...data,
    id,
  });

  return {
    ...data,
    id,
    name: limitInputLength((data.name ?? "").trim()),
    balance: clampBalance(data.balance),
    totalDeposited,
    totalWithdrawn,
    medals: normalizeMedals(data.medals),
    role: data.role === "admin" ? "admin" : undefined,
  };
}
