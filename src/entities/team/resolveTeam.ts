import type { BetTeamSide } from "@/entities/bet";
import { assetLogoSlug } from "@/shared/lib/logos/assetLogo";
import { getTeamMatchKey, resolveCanonicalTeamName, teamNamesMatch } from "@/shared/lib/teams/teamNames";
import type { Team } from "./types";

export function resolveTeamIdFromName(name: string): string {
  const canonical = resolveCanonicalTeamName(name);
  if (!canonical) return "";
  return getTeamMatchKey(canonical);
}

export function buildTeamFromName(name: string, synonyms: string[] = []): Team | null {
  const canonical = resolveCanonicalTeamName(name);
  if (!canonical) return null;

  const id = getTeamMatchKey(canonical);
  if (!id) return null;

  return {
    id,
    name: canonical,
    synonyms,
    logoSlug: assetLogoSlug(canonical),
    vrsPoints: 0,
  };
}

export interface TeamSides {
  team1Id?: string | null;
  team2Id?: string | null;
  organization1?: string;
  organization2?: string;
}

export function attachTeamIds<T extends { organization1?: string; organization2?: string; team1Id?: string; team2Id?: string }>(
  record: T
): T & { team1Id: string; team2Id: string } {
  const team1FromName = resolveTeamIdFromName(record.organization1 ?? "");
  const team2FromName = resolveTeamIdFromName(record.organization2 ?? "");
  const existingTeam1Id = record.team1Id?.trim() ?? "";
  const existingTeam2Id = record.team2Id?.trim() ?? "";

  return {
    ...record,
    team1Id: team1FromName || (existingTeam1Id ? getTeamMatchKey(existingTeam1Id) : ""),
    team2Id: team2FromName || (existingTeam2Id ? getTeamMatchKey(existingTeam2Id) : ""),
  };
}

export function resolveBetTeamId(
  bet: TeamSides & {
    betTeam: BetTeamSide;
    betTeamId?: string | null;
  }
): string {
  const explicit = bet.betTeamId?.trim();
  if (explicit) return explicit;
  return bet.betTeam === 2
    ? bet.team2Id?.trim() || resolveTeamIdFromName(bet.organization2 ?? "")
    : bet.team1Id?.trim() || resolveTeamIdFromName(bet.organization1 ?? "");
}

export function teamIdsMatch(
  left: string | null | undefined,
  right: string | null | undefined
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
    (teamNamesMatch(left.organization1 ?? "", right.organization1 ?? "") &&
      teamNamesMatch(left.organization2 ?? "", right.organization2 ?? "")) ||
    (teamNamesMatch(left.organization1 ?? "", right.organization2 ?? "") &&
      teamNamesMatch(left.organization2 ?? "", right.organization1 ?? ""))
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
    teamNamesMatch(left.organization1 ?? "", right.organization1 ?? "") &&
    teamNamesMatch(left.organization2 ?? "", right.organization2 ?? "")
  );
}

export function betTeamOnMatchSide(
  bet: TeamSides & {
    betTeam: BetTeamSide;
    betTeamId?: string | null;
  },
  match: TeamSides
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

function matchTeamNameInSides(
  name: string,
  organization1: string,
  organization2: string
): BetTeamSide | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (organization1 && teamNamesMatch(trimmed, organization1)) return 1;
  if (organization2 && teamNamesMatch(trimmed, organization2)) return 2;
  return null;
}

/** Определяет сторону ставки по тексту betType и названиям команд матча. */
export function inferBetTeamFromDescription(
  betType: string,
  organization1 = "",
  organization2 = ""
): BetTeamSide {
  const text = betType.trim();
  if (!text) return 1;

  if (/больше/i.test(text)) return 2;
  if (/меньше/i.test(text)) return 1;
  if (/^W2$/i.test(text) || /команда\s*2|^к2$/i.test(text)) return 2;
  if (/^W1$/i.test(text) || /команда\s*1|^к1$/i.test(text)) return 1;

  const parts = text.split(/\s*[—–-]\s*/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2 && (organization1 || organization2)) {
    const last = parts[parts.length - 1] ?? "";
    if (/^(да|нет)$/i.test(last) && parts.length >= 3) {
      const fromName = matchTeamNameInSides(parts[parts.length - 2] ?? "", organization1, organization2);
      if (fromName) return fromName;
    }

    const fromName = matchTeamNameInSides(last, organization1, organization2);
    if (fromName) return fromName;
  }

  if (/\b(2|втор)/i.test(text) && !/\b1\b/.test(text)) return 2;
  return 1;
}
