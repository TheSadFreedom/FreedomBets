import type { Match } from "@/entities/match";
import type { Tournament } from "@/entities/eventRecord";
import type { Team } from "@/entities/team";
import { resolveTeamDisplayName } from "@/shared/lib/teams/resolveTeamDisplayName";

export interface EnrichedMatchView extends Match {
  eventName: string;
  organization1: string;
  organization2: string;
}

function findTournament(
  match: Match,
  tournamentsById: Map<string, Tournament>,
  tournaments: Tournament[]
): Tournament | undefined {
  const eventId = match.eventId?.trim();
  if (eventId) {
    const byId = tournamentsById.get(eventId);
    if (byId) return byId;
  }

  const legacyName = match.eventName?.trim().toLowerCase();
  if (!legacyName) return undefined;

  return tournaments.find((item) => item.name.trim().toLowerCase() === legacyName);
}

export function enrichMatch(
  match: Match,
  teamsById: Map<string, Team>,
  tournamentsById: Map<string, Tournament>,
  tournaments: Tournament[] = []
): EnrichedMatchView {
  const tournament = findTournament(match, tournamentsById, tournaments);

  const eventId = match.eventId?.trim() || tournament?.id || "";
  const eventName = tournament?.name || match.eventName?.trim() || "";

  return {
    ...match,
    eventId,
    eventName,
    organization1: resolveTeamDisplayName(
      match.team1Id,
      match.organization1,
      teamsById
    ),
    organization2: resolveTeamDisplayName(
      match.team2Id,
      match.organization2,
      teamsById
    ),
  };
}

export function enrichMatches(
  matches: Match[],
  teams: Team[],
  tournaments: Tournament[]
): EnrichedMatchView[] {
  const teamsById = new Map(teams.map((item) => [item.id, item]));
  const tournamentsById = new Map(tournaments.map((item) => [item.id, item]));
  return matches.map((item) => enrichMatch(item, teamsById, tournamentsById, tournaments));
}
