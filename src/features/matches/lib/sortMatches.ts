import type { Match } from "@/entities/match";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";

function matchDateTimeKey(match: Pick<Match, "date" | "time">): string {
  return `${match.date}T${match.time}`;
}

/** По дате и времени, новые сверху */
export function sortMatchesByDateTime(matches: Match[]): Match[] {
  return [...matches].sort((a, b) =>
    matchDateTimeKey(b).localeCompare(matchDateTimeKey(a))
  );
}

/** По времени в пределах одного дня, раньше — выше */
export function sortMatchesByTimeAsc(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => a.time.localeCompare(b.time));
}

/** По дате и времени, раньше — выше */
export function sortMatchesByDateTimeAsc(matches: Match[]): Match[] {
  return [...matches].sort((a, b) =>
    matchDateTimeKey(a).localeCompare(matchDateTimeKey(b))
  );
}

export interface MatchesByDaySections {
  future: Match[];
  today: Match[];
  past: Match[];
}

/** Будущие, сегодня и прошедшие — по календарной дате */
export function splitMatchesByTodayAndPast(
  matches: Match[],
  today = todayIsoDateLocal()
): MatchesByDaySections {
  const futureMatches: Match[] = [];
  const todayMatches: Match[] = [];
  const pastMatches: Match[] = [];

  for (const match of matches) {
    if (match.date > today) {
      futureMatches.push(match);
    } else if (match.date === today) {
      todayMatches.push(match);
    } else {
      pastMatches.push(match);
    }
  }

  return {
    future: sortMatchesByDateTimeAsc(futureMatches),
    today: sortMatchesByTimeAsc(todayMatches),
    past: sortMatchesByDateTime(pastMatches),
  };
}
