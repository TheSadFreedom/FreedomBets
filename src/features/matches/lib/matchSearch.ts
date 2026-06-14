import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { getMatchEventLabel } from "@/features/matches/lib/matchEventLabel";
import { formatMatchTeamsLabel } from "@/features/matches/lib/matchDisplay";
import { matchesSearchQuery } from "@/shared/lib/search/textSearch";
import { getTeamSearchTerms } from "@/shared/lib/teams/teamNames";

function getMatchTeamName(match: Match, side: 1 | 2): string {
  return side === 1
    ? (match.organization1 ?? "").trim() || match.team1Id.trim()
    : (match.organization2 ?? "").trim() || match.team2Id.trim();
}

export function getMatchSearchTerms(match: Match, events: EventRecord[] = []): string[] {
  const team1 = getMatchTeamName(match, 1);
  const team2 = getMatchTeamName(match, 2);

  return [
    getMatchEventLabel(match, events),
    team1,
    team2,
    formatMatchTeamsLabel(match),
    match.format,
    match.date,
    match.time,
    match.status,
    ...getTeamSearchTerms(team1),
    ...getTeamSearchTerms(team2),
  ];
}

export function searchMatches(
  matches: Match[],
  query: string,
  events: EventRecord[] = [],
): Match[] {
  if (!query.trim()) return matches;
  return matches.filter((match) =>
    matchesSearchQuery(getMatchSearchTerms(match, events), query),
  );
}
