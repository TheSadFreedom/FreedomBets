import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { formatEventLabel } from "@/features/events/lib/eventDisplay";
import { isBetForMatch } from "@/features/matches/lib/findBetsForMatch";
import { parseMatchDateTime } from "@/features/matches/lib/getMatchEffectiveStatus";
import { sortMatchesByDateTime } from "@/features/matches/lib/sortMatches";
import { formatIsoDateTimeDots } from "@/shared/lib/date/isoDate";

export type MatchBetFields = Pick<
  Bet,
  "date" | "format" | "eventId" | "eventName" | "team1Id" | "team2Id"
>;

export interface MatchSelectOption {
  id: string;
  match: Match;
  primary: string;
  secondary: string;
}

export function formatMatchTeamsLabel(
  match: Pick<Match, "team1Id" | "team2Id"> & { organization1?: string; organization2?: string }
): string {
  const left = match.organization1?.trim() || match.team1Id.trim();
  const right = match.organization2?.trim() || match.team2Id.trim();
  return `${left} vs ${right}`;
}

export function formatMatchSecondaryLabel(match: Match): string {
  const event = formatEventLabel("", (match as Match & { eventName?: string }).eventName ?? "");
  const parts = [formatIsoDateTimeDots(match.date, match.time), match.format];
  if (event.trim()) parts.push(event);
  return parts.join(" · ");
}

export function findMatchForBetFields(
  fields: Partial<MatchBetFields>,
  matches: Match[]
): Match | undefined {
  if (
    !fields.date?.trim() ||
    !fields.format ||
    !fields.team1Id?.trim() ||
    !fields.team2Id?.trim()
  ) {
    return undefined;
  }
  const probe = {
    date: fields.date,
    format: fields.format,
    eventId: fields.eventId ?? "",
    eventName: fields.eventName ?? "",
    team1Id: fields.team1Id ?? "",
    team2Id: fields.team2Id ?? "",
  } as MatchBetFields;
  return matches.find((match) => isBetForMatch(probe as Bet, match));
}

export interface MatchSelectOptionsFilter {
  /** Показывать только матчи на эту дату (ISO YYYY-MM-DD) */
  onDate?: string;
  /** Исключить матчи, время старта которых позже текущего момента */
  notAfterNow?: boolean;
  /** Всегда включать эти матчи, даже если фильтры не проходят */
  includeIds?: string[];
  /** Текущий момент (для тестов) */
  now?: number;
}

export function getMatchSelectOptions(
  matches: Match[],
  filter?: MatchSelectOptionsFilter
): MatchSelectOption[] {
  let list = matches;
  if (filter?.onDate || filter?.notAfterNow) {
    const include = new Set(filter.includeIds ?? []);
    const now = filter.now ?? Date.now();
    list = matches.filter((match) => {
      if (include.has(match.id)) return true;
      if (filter.onDate && match.date !== filter.onDate) return false;
      if (filter.notAfterNow) {
        const start = parseMatchDateTime(match);
        if (start && start.getTime() > now) return false;
      }
      return true;
    });
  }
  return sortMatchesByDateTime(list).map((match) => ({
    id: match.id,
    match,
    primary: formatMatchTeamsLabel(match),
    secondary: formatMatchSecondaryLabel(match),
  }));
}
