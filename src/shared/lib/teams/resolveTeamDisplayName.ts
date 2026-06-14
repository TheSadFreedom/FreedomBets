import type { Team } from "@/entities/team";
import { getTeamMatchKey, resolveCanonicalTeamName } from "./teamNames";

export function resolveTeamDisplayName(
  teamId: string,
  legacyName: string | undefined,
  teamsById: Map<string, Team>
): string {
  const id = teamId.trim();
  const legacy = legacyName?.trim();
  const source = legacy || id;
  if (!source) return "";

  const matchKeys = [
    legacy ? getTeamMatchKey(legacy) : "",
    id ? getTeamMatchKey(id) : "",
    id,
  ].filter(Boolean);

  for (const key of matchKeys) {
    const team = teamsById.get(key);
    if (team?.name?.trim()) {
      return resolveCanonicalTeamName(team.name) || team.name.trim();
    }
  }

  const canonical = resolveCanonicalTeamName(source);
  return canonical || source;
}
