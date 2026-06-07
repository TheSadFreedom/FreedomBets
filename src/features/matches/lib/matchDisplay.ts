import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { formatEventLabel } from "@/features/events/lib/eventDisplay";
import { isBetForMatch } from "@/features/matches/lib/findBetsForMatch";
import { parseMatchDateTime } from "@/features/matches/lib/getMatchEffectiveStatus";
import { sortMatchesByDateTime } from "@/features/matches/lib/sortMatches";
import { formatIsoDateTimeDots } from "@/shared/lib/date/isoDate";

export type MatchBetFields = Pick<
  Bet,
  "date" | "format" | "eventOrganization" | "eventName" | "organization1" | "organization2"
>;

export interface MatchSelectOption {
  id: string;
  match: Match;
  primary: string;
  secondary: string;
}

export function formatMatchTeamsLabel(match: Pick<Match, "organization1" | "organization2">): string {
  return `${match.organization1.trim()} vs ${match.organization2.trim()}`;
}

export function formatMatchSecondaryLabel(match: Match): string {
  const event = formatEventLabel(match.eventOrganization, match.eventName, {
    eventTier: match.majorStage ? "Major" : undefined,
    majorStage: match.majorStage,
  });
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
    !fields.organization1?.trim() ||
    !fields.organization2?.trim()
  ) {
    return undefined;
  }
  const probe = {
    date: fields.date,
    format: fields.format,
    eventOrganization: fields.eventOrganization ?? "",
    eventName: fields.eventName ?? "",
    organization1: fields.organization1,
    organization2: fields.organization2,
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
