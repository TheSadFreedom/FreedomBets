import type { Match, MatchStatus } from "@/entities/match";
import { parseIsoDate } from "@/shared/lib/date/isoDate";

export function parseMatchDateTime(match: Pick<Match, "date" | "time">): Date | null {
  const parts = parseIsoDate(match.date);
  if (!parts) return null;
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(match.time);
  if (!timeMatch) return null;
  const h = Number(timeMatch[1]);
  const min = Number(timeMatch[2]);
  if (h > 23 || min > 59) return null;
  return new Date(parts.y, parts.m - 1, parts.d, h, min);
}

/** Скоро до начала, завершён после времени старта */
export function getMatchEffectiveStatus(match: Match, now = Date.now()): MatchStatus {
  const start = parseMatchDateTime(match);
  if (!start) return match.status === "finished" ? "finished" : "scheduled";

  return now < start.getTime() ? "scheduled" : "finished";
}
