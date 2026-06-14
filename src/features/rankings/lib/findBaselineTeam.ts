import type { RankingBaseline, RankingBaselineTeam } from "@/entities/ranking";
import { getTeamMatchKey } from "@/shared/lib/teams/teamNames";

export function findBaselineTeam(
  baseline: RankingBaseline | null,
  teamName: string,
): RankingBaselineTeam | null {
  if (!baseline) return null;

  const key = getTeamMatchKey(teamName);
  if (!key) return null;

  const matches = baseline.teams.filter((team) => team.teamKey === key);
  if (matches.length === 0) return null;

  return matches.reduce((best, team) =>
    team.globalRank < best.globalRank ? team : best
  );
}
