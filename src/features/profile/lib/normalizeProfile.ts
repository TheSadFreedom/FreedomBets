import type { Profile } from "@/entities/profile";
import { clampBalance, limitInputLength, roundMoney } from "@/shared/lib/limits";
import { parseProfileId } from "./profileId";

export function normalizeProfile(data: Profile): Profile {
  const id = parseProfileId(data.id);
  if (id == null) {
    throw new Error(`Invalid profile id: ${String(data.id)}`);
  }
  return {
    ...data,
    id,
    name: limitInputLength((data.name ?? "").trim()),
    balance: clampBalance(data.balance),
    balanceBase:
      typeof data.balanceBase === "number" && Number.isFinite(data.balanceBase)
        ? roundMoney(data.balanceBase)
        : undefined,
    role: data.role === "admin" ? "admin" : undefined,
  };
}
