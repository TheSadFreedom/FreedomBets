import type { RankingBaseline, RankingBaselineTeam } from "@/entities/ranking";
import { getTeamMatchKey } from "@/shared/lib/teams/teamNames";

export function findBaselineTeam(
  baseline: RankingBaseline | null,
  teamName: string,
): RankingBaselineTeam | null {
  if (!baseline) return null;

  const key = getTeamMatchKey(teamName);
  if (!key) return null;

  return baseline.teams.find((team) => team.teamKey === key) ?? null;
}
