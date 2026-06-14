import type { BetTeamSide } from "@/entities/bet";
import { assetLogoSlug } from "@/shared/lib/logos/assetLogo";
import { getTeamMatchKey, resolveCanonicalTeamName, teamNamesMatch } from "@/shared/lib/teams/teamNames";
import type { Team, TeamSides } from "./types";

export function resolveTeamIdFromName(name: string): string {
  const canonical = resolveCanonicalTeamName(name);
  if (!canonical) return "";
  return getTeamMatchKey(canonical);
}

export function buildTeamFromName(name: string): Team | null {
  const canonical = resolveCanonicalTeamName(name);
  if (!canonical) return null;

  const teamKey = getTeamMatchKey(canonical);
  if (!teamKey) return null;

  return {
    id: teamKey,
    teamKey,
    name: canonical,
    logoSlug: assetLogoSlug(canonical),
  };
}

export function attachTeamIds<T extends { organization1: string; organization2: string }>(
  record: T,
): T & { team1Id: string; team2Id: string } {
  return {
    ...record,
    team1Id: resolveTeamIdFromName(record.organization1),
    team2Id: resolveTeamIdFromName(record.organization2),
  };
}

export function resolveBetTeamId(
  bet: TeamSides & {
    betTeam: BetTeamSide;
    betTeamId?: string | null;
  },
): string {
  const explicit = bet.betTeamId?.trim();
  if (explicit) return explicit;
  return bet.betTeam === 2
    ? bet.team2Id?.trim() || resolveTeamIdFromName(bet.organization2)
    : bet.team1Id?.trim() || resolveTeamIdFromName(bet.organization1);
}

export function teamIdsMatch(
  left: string | null | undefined,
  right: string | null | undefined,
): boolean {
  const a = String(left ?? "").trim();
  const b = String(right ?? "").trim();
  return Boolean(a && b && a === b);
}

function hasTeamIds(record: TeamSides): boolean {
  return Boolean(record.team1Id?.trim() && record.team2Id?.trim());
}

export function teamPairsMatch(left: TeamSides, right: TeamSides): boolean {
  if (hasTeamIds(left) && hasTeamIds(right)) {
    return (
      (teamIdsMatch(left.team1Id, right.team1Id) &&
        teamIdsMatch(left.team2Id, right.team2Id)) ||
      (teamIdsMatch(left.team1Id, right.team2Id) &&
        teamIdsMatch(left.team2Id, right.team1Id))
    );
  }

  return (
    (teamNamesMatch(left.organization1, right.organization1) &&
      teamNamesMatch(left.organization2, right.organization2)) ||
    (teamNamesMatch(left.organization1, right.organization2) &&
      teamNamesMatch(left.organization2, right.organization1))
  );
}

export function teamsSameOrder(left: TeamSides, right: TeamSides): boolean {
  if (hasTeamIds(left) && hasTeamIds(right)) {
    return (
      teamIdsMatch(left.team1Id, right.team1Id) &&
      teamIdsMatch(left.team2Id, right.team2Id)
    );
  }

  return (
    teamNamesMatch(left.organization1, right.organization1) &&
    teamNamesMatch(left.organization2, right.organization2)
  );
}

export function betTeamOnMatchSide(
  bet: TeamSides & {
    betTeam: BetTeamSide;
    betTeamId?: string | null;
  },
  match: TeamSides,
): BetTeamSide {
  if (bet.betTeam !== 1 && bet.betTeam !== 2) {
    return bet.betTeam as BetTeamSide;
  }

  const betTeamId = resolveBetTeamId(bet);
  if (betTeamId && hasTeamIds(match)) {
    if (teamIdsMatch(betTeamId, match.team1Id)) return 1;
    if (teamIdsMatch(betTeamId, match.team2Id)) return 2;
  }

  if (teamsSameOrder(bet, match)) return bet.betTeam;
  return bet.betTeam === 1 ? 2 : 1;
}
