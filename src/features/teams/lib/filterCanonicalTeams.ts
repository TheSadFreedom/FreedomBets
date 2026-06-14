import type { Team } from "@/entities/team";
import { getTeamMatchKey } from "@/shared/lib/teams/teamNames";

export function filterCanonicalTeams(teams: Team[]): Team[] {
  const list = teams.filter((team) => team.id.trim() && team.name.trim());

  return list.filter((team) => {
    for (const other of list) {
      if (other.id === team.id) continue;

      if ((other.synonyms ?? []).includes(team.name)) {
        return false;
      }

      if (getTeamMatchKey(team.name) === other.id && team.id !== other.id) {
        return false;
      }
    }

    return true;
  });
}
