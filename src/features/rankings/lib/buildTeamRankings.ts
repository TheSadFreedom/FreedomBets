import type { RankingBaseline, RankingBaselineTeam } from "@/entities/ranking";
import { dedupeBaselineTeams } from "./dedupeBaselineTeams";
import { parseGlobalRank, parseRankingPoints } from "./parseRankingPoints";

export function normalizeBaselineTeam(team: RankingBaselineTeam): RankingBaselineTeam {
  return {
    ...team,
    teamKey: String(team.teamKey ?? "").trim(),
    teamName: String(team.teamName ?? "").trim(),
    globalRank: parseGlobalRank(team.globalRank),
    points: parseRankingPoints(team.points),
  };
}

export function buildTeamRankings(baseline: RankingBaseline | null): RankingBaselineTeam[] {
  if (!baseline?.teams?.length) return [];

  return dedupeBaselineTeams(baseline.teams)
    .map(normalizeBaselineTeam)
    .filter((team) => team.teamName && team.globalRank > 0)
    .sort((a, b) => a.globalRank - b.globalRank);
}
