import type { Bet, StoredBet } from "@/entities/bet";
import type { Tournament } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import type { Team } from "@/entities/team";
import { enrichBets } from "@/shared/lib/db/enrichBet";
import { enrichMatches } from "@/shared/lib/db/enrichMatch";
import { normalizeStoredBet } from "@/features/profile/lib/normalizeBet";
import { normalizeMatch } from "@/features/matches/lib/normalizeMatch";
import { normalizeTournament } from "@/features/profile/lib/normalizeEventRecord";
import { normalizeTeam } from "@/features/teams/lib/normalizeTeam";
import { applyDbTeamSynonyms } from "@/shared/lib/teams/teamNames";

export function normalizeStoredBets(raw: unknown[]): StoredBet[] {
  return raw.map((item) => normalizeStoredBet(item as Parameters<typeof normalizeStoredBet>[0]));
}

export function buildDbContext(
  rawMatches: unknown[],
  rawTournaments: unknown[],
  rawTeams: unknown[]
) {
  const tournaments = rawTournaments.map((item) =>
    normalizeTournament(item as Tournament)
  );
  const teams = rawTeams.map((item) => normalizeTeam(item as Team));
  const matches = rawMatches.map((item) => normalizeMatch(item as Match));
  return { tournaments, teams, matches };
}

/** Applies team synonyms before building enrich context. */
export function prepareDbContext(
  rawMatches: unknown[],
  rawTournaments: unknown[],
  rawTeams: unknown[]
) {
  const teams = rawTeams.map((item) => normalizeTeam(item as Team));
  applyDbTeamSynonyms(teams);
  return buildDbContext(rawMatches, rawTournaments, teams);
}

export function enrichAllBets(storedBets: StoredBet[], ctx: ReturnType<typeof buildDbContext>): Bet[] {
  return enrichBets(storedBets, ctx.matches, ctx.teams, ctx.tournaments);
}

export function enrichAllMatches(ctx: ReturnType<typeof buildDbContext>) {
  return enrichMatches(ctx.matches, ctx.teams, ctx.tournaments);
}

export function tournamentNameById(tournaments: Tournament[], id: string): string {
  return tournaments.find((item) => item.id === id)?.name ?? "";
}

export function teamNameById(teams: Team[], id: string): string {
  return teams.find((item) => item.id === id)?.name ?? id;
}
