import type { Team } from "@/entities/team";
import { assetLogoSlug } from "@/shared/lib/logos/assetLogo";
import { limitInputLength } from "@/shared/lib/limits";

export function normalizeTeam(data: Team): Team {
  const id = String(data.id ?? "").trim();
  const name = limitInputLength(String(data.name ?? "").trim());
  const synonyms = Array.isArray(data.synonyms)
    ? [...new Set(data.synonyms.map((item) => limitInputLength(String(item).trim())).filter(Boolean))]
    : [];

  return {
    id,
    name,
    synonyms,
    logoSlug: data.logoSlug?.trim() || assetLogoSlug(name),
    vrsPoints: Number.isFinite(Number(data.vrsPoints)) ? Number(data.vrsPoints) : 0,
  };
}
