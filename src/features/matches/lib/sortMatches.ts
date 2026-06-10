import type { Match } from "@/entities/match";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
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

export interface MatchesByStatusSections {
  live: Match[];
  scheduled: Match[];
  finished: Match[];
}

/** Live, скоро и завершённые; live и скоро — по возрастанию даты, завершённые — по убыванию */
export function splitMatchesByEffectiveStatus(
  matches: Match[],
  now = Date.now()
): MatchesByStatusSections {
  const live: Match[] = [];
  const scheduled: Match[] = [];
  const finished: Match[] = [];

  for (const match of matches) {
    const status = getMatchEffectiveStatus(match, now);
    if (status === "finished") {
      finished.push(match);
    } else if (status === "live") {
      live.push(match);
    } else {
      scheduled.push(match);
    }
  }

  const sortAsc = (a: Match, b: Match) =>
    matchDateTimeKey(a).localeCompare(matchDateTimeKey(b));

  return {
    live: live.sort(sortAsc),
    scheduled: scheduled.sort(sortAsc),
    finished: sortMatchesByDateTime(finished),
  };
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
