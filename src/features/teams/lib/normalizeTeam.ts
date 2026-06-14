import type { Team } from "@/entities/team";
import { assetLogoSlug } from "@/shared/lib/logos/assetLogo";

export function normalizeTeam(data: Team): Team {
  const id = String(data.id ?? data.teamKey ?? "").trim();
  const name = String(data.name ?? "").trim();

  return {
    id,
    teamKey: String(data.teamKey ?? id).trim(),
    name,
    logoSlug: String(data.logoSlug ?? "").trim() || assetLogoSlug(name || id),
  };
}
