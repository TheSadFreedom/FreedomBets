import type { RankingBaselineTeam } from "@/entities/ranking";

/** Drop exact duplicate rows that can appear after repeated imports. */
export function dedupeBaselineTeams(teams: RankingBaselineTeam[]): RankingBaselineTeam[] {
  const seen = new Set<string>();

  return teams.filter((team) => {
    const id = `${team.globalRank}|${team.teamKey}|${team.teamName}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
