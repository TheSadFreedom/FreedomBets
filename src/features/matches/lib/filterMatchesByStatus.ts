import type { Match, MatchStatus } from "@/entities/match";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";

export type MatchStatusFilter = "all" | MatchStatus;

export const MATCH_STATUS_FILTER_OPTIONS: Array<{
  value: MatchStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Все" },
  { value: "live", label: "Live" },
  { value: "scheduled", label: "Скоро" },
  { value: "finished", label: "Завершённые" },
];

export function filterMatchesByStatus(
  matches: Match[],
  status: MatchStatusFilter,
  now = Date.now(),
): Match[] {
  if (status === "all") return matches;
  return matches.filter((match) => getMatchEffectiveStatus(match, now) === status);
}
