import type { Match } from "@/entities/match";
import { getMatchSeriesScore } from "@/features/matches/lib/matchMaps";

export function normalizeScoreValue(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

export function hasMatchScore(
  match: Pick<Match, "format" | "maps"> & { score1?: number | null; score2?: number | null }
): boolean {
  return getMatchSeriesScore(match) != null;
}
