import type { Profile } from "@/entities/profile";
import { clampBalance, limitInputLength, roundMoney } from "@/shared/lib/limits";
import { resolveBalanceTotals } from "./profileBalance";
import { parseProfileId } from "./profileId";

export function normalizeProfile(data: Profile): Profile {
  const id = parseProfileId(data.id);
  if (id == null) {
    throw new Error(`Invalid profile id: ${String(data.id)}`);
  }
  const balanceBase =
    typeof data.balanceBase === "number" && Number.isFinite(data.balanceBase)
      ? roundMoney(data.balanceBase)
      : undefined;
  const { totalDeposited, totalWithdrawn } = resolveBalanceTotals({
    ...data,
    id,
    balanceBase,
  });

  return {
    ...data,
    id,
    name: limitInputLength((data.name ?? "").trim()),
    balance: clampBalance(data.balance),
    balanceBase,
    totalDeposited,
    totalWithdrawn,
    role: data.role === "admin" ? "admin" : undefined,
  };
}
