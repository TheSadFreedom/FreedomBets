import type { Match } from "@/entities/match";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { getMatchSeriesScore } from "@/features/matches/lib/matchMaps";
import { sortMatchesByDateTime } from "@/features/matches/lib/sortMatches";
import { teamNamesMatch } from "@/shared/lib/teams/teamNames";

export type TeamRecentMatchResult = "win" | "lose";

export interface TeamRecentMatchItem {
  matchId: string;
  opponent: string;
  teamScore: number;
  opponentScore: number;
  result: TeamRecentMatchResult;
}

const RECENT_MATCH_LIMIT = 5;

function getTeamSide(match: Match, teamName: string): 1 | 2 | null {
  if (teamNamesMatch(match.organization1, teamName)) return 1;
  if (teamNamesMatch(match.organization2, teamName)) return 2;
  return null;
}

export function getTeamRecentMatches(
  matches: Match[],
  teamName: string,
  excludeMatchId?: string,
): TeamRecentMatchItem[] {
  const trimmedTeam = teamName.trim();
  if (!trimmedTeam) return [];

  const finished = sortMatchesByDateTime(matches).filter((match) => {
    if (excludeMatchId && match.id === excludeMatchId) return false;
    if (getMatchEffectiveStatus(match) !== "finished") return false;
    if (getTeamSide(match, trimmedTeam) == null) return false;

    const series = getMatchSeriesScore(match);
    return series != null && series.score1 !== series.score2;
  });

  return finished.slice(0, RECENT_MATCH_LIMIT).map((match) => {
    const side = getTeamSide(match, trimmedTeam);
    const series = getMatchSeriesScore(match);
    if (side == null || series == null) {
      throw new Error("Unexpected match without series score");
    }

    const teamScore = side === 1 ? series.score1 : series.score2;
    const opponentScore = side === 1 ? series.score2 : series.score1;
    const opponent = side === 1 ? match.organization2 : match.organization1;

    return {
      matchId: match.id,
      opponent,
      teamScore,
      opponentScore,
      result: teamScore > opponentScore ? "win" : "lose",
    };
  });
}
