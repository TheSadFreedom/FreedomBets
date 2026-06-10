import { getMapCount, type MatchFormat } from "@/entities/bet";
import type { Match, MatchMap } from "@/entities/match";
import { normalizeScoreValue } from "@/features/matches/lib/matchScore";

export const CS_MAP_NAMES = [
  "Ancient",
  "Anubis",
  "Dust2",
  "Inferno",
  "Mirage",
  "Nuke",
  "Overpass",
  "Train",
  "Vertigo",
] as const;

export function createEmptyMaps(format: MatchFormat): MatchMap[] {
  return Array.from({ length: getMapCount(format) }, () => ({
    name: "",
    score1: null,
    score2: null,
  }));
}

export function normalizeMapEntry(value: unknown): MatchMap {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    name: typeof record.name === "string" ? record.name.trim() : "",
    score1: normalizeScoreValue(record.score1),
    score2: normalizeScoreValue(record.score2),
  };
}

export function normalizeMapsForFormat(maps: unknown, format: MatchFormat): MatchMap[] {
  const count = getMapCount(format);
  const raw = Array.isArray(maps) ? maps : [];
  const normalized = raw.slice(0, count).map(normalizeMapEntry);

  while (normalized.length < count) {
    normalized.push({ name: "", score1: null, score2: null });
  }

  return normalized;
}

export function resizeMapsForFormat(maps: MatchMap[], format: MatchFormat): MatchMap[] {
  return normalizeMapsForFormat(maps, format);
}

export function getMapWinner(map: MatchMap): 1 | 2 | null {
  if (map.score1 == null || map.score2 == null || map.score1 === map.score2) return null;
  return map.score1 > map.score2 ? 1 : 2;
}

export function hasMapRoundScore(map: MatchMap): boolean {
  return map.score1 != null && map.score2 != null;
}

export function hasAnyMapData(map: MatchMap): boolean {
  return Boolean(map.name.trim()) || map.score1 != null || map.score2 != null;
}

export function mapsNeededToWin(format: MatchFormat): number {
  return Math.ceil(getMapCount(format) / 2);
}

/** Счёт серии по выигранным картам */
export function getSeriesScoreFromMaps(
  maps: MatchMap[],
  format: MatchFormat
): { score1: number; score2: number } | null {
  let score1 = 0;
  let score2 = 0;
  let hasAny = false;

  for (const map of normalizeMapsForFormat(maps, format)) {
    const winner = getMapWinner(map);
    if (winner === 1) {
      score1 += 1;
      hasAny = true;
    } else if (winner === 2) {
      score2 += 1;
      hasAny = true;
    }
  }

  return hasAny ? { score1, score2 } : null;
}

export function getMatchSeriesScore(
  match: Pick<Match, "format" | "maps"> & { score1?: number | null; score2?: number | null }
): { score1: number; score2: number } | null {
  const fromMaps = getSeriesScoreFromMaps(match.maps, match.format);
  if (fromMaps) return fromMaps;

  if (match.score1 != null && match.score2 != null) {
    return { score1: match.score1, score2: match.score2 };
  }

  return null;
}

export function sanitizeMapsForSave(maps: MatchMap[], format: MatchFormat): MatchMap[] {
  return normalizeMapsForFormat(maps, format).map((map) => ({
    name: map.name.trim(),
    score1: hasMapRoundScore(map) ? map.score1 : null,
    score2: hasMapRoundScore(map) ? map.score2 : null,
  }));
}
