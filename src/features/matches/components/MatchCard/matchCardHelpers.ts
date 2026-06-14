import { mergeEventTitle } from "@/features/events/lib/eventTitle";
import type { Match } from "@/entities/match";
import type { MouseEvent } from "react";

export const MATCH_STATUS_LABELS: Record<Match["status"], string> = {
  scheduled: "скоро",
  live: "live",
  finished: "завершён",
};

export function formatMatchEventTitle(match: Match): string {
  return mergeEventTitle("", match.eventName ?? "");
}
export function matchScoreTone(
  side: 1 | 2,
  leadingSide: 1 | 2 | null,
  hasScores: boolean,
): "win" | "lose" | "neutral" {
  if (!hasScores || leadingSide == null) return "neutral";
  return side === leadingSide ? "win" : "lose";
}

export function stopAccordionToggle(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}
