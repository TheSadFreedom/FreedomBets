import type { Match } from "@/entities/match";

export function normalizeScoreValue(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

export function hasMatchScore(match: Pick<Match, "score1" | "score2">): boolean {
  return match.score1 != null && match.score2 != null;
}
