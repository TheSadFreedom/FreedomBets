import type { Bet } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { teamPairsMatch } from "@/entities/team";

const norm = (value: string) => value.trim().toLowerCase();

function stagesEqual(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  return (a ?? null) === (b ?? null);
}

function teamsMatch(bet: Bet, match: Match): boolean {
  return teamPairsMatch(bet, match);
}

function eventTeamsFormatMatch(
  bet: Bet,
  match: Match,
  options?: { ignoreStage?: boolean }
): boolean {
  const eventMatch =
    bet.eventId && match.eventId
      ? bet.eventId === match.eventId
      : norm(bet.eventName) === norm(match.eventName ?? "");
  return (
    bet.format === match.format &&
    eventMatch &&
    (options?.ignoreStage || stagesEqual(bet.majorStage, match.majorStage)) &&
    teamsMatch(bet, match)
  );
}

/** Сопоставление старых ставок без matchId по турниру, командам, формату и дате/времени. */
export function legacyBetMatchesMatch(
  bet: Bet,
  match: Match,
  options?: { ignoreStage?: boolean }
): boolean {
  if (!eventTeamsFormatMatch(bet, match, options)) {
    return false;
  }
  if (bet.date === match.date) {
    return true;
  }
  return bet.time === match.time;
}

function matchIdsEqual(bet: Bet, match: Match): boolean {
  const linked = bet.matchId?.trim();
  const matchId = String(match.id ?? "").trim();
  return Boolean(linked && matchId && linked === matchId);
}

function isOrphanMatchId(bet: Bet, knownMatchIds?: ReadonlySet<string>): boolean {
  const linked = bet.matchId?.trim();
  if (!linked) return false;
  if (!knownMatchIds) return false;
  return !knownMatchIds.has(linked);
}

function pickUniqueMatch(candidates: Match[], bet: Bet): Match | null {
  if (candidates.length === 1) {
    return candidates[0];
  }
  const byDate = candidates.filter((match) => match.date === bet.date);
  if (byDate.length === 1) {
    return byDate[0];
  }
  const byTime = candidates.filter((match) => match.time === bet.time);
  if (byTime.length === 1) {
    return byTime[0];
  }
  return null;
}

/** Найти матч для ставки; для старых записей — по полям, без matchId. */
export function findMatchForBet(bet: Bet, matches: Match[]): Match | null {
  const linkedMatchId = bet.matchId?.trim();
  if (linkedMatchId) {
    const direct = matches.find((match) => matchIdsEqual(bet, match));
    if (direct) return direct;
    if (!isOrphanMatchId(bet, new Set(matches.map((match) => String(match.id).trim())))) {
      return null;
    }
  }
  return pickUniqueMatch(matches.filter((match) => legacyBetMatchesMatch(bet, match)), bet);
}

/** Связь по matchId или по турниру, командам и формату (дата и/или время). */
export function isBetForMatch(
  bet: Bet,
  match: Match,
  options?: { knownMatchIds?: ReadonlySet<string>; ignoreStage?: boolean }
): boolean {
  if (matchIdsEqual(bet, match)) {
    return true;
  }

  const linked = bet.matchId?.trim();
  if (linked && options?.knownMatchIds?.has(linked)) {
    return false;
  }

  return legacyBetMatchesMatch(bet, match, options);
}

/** Как isBetForMatch, но для старых ставок стадия не учитывается. */
export function isBetLinkedToMatch(
  bet: Bet,
  match: Match,
  options?: { knownMatchIds?: ReadonlySet<string> }
): boolean {
  return isBetForMatch(bet, match, { ...options, ignoreStage: true });
}

export function findLinkedBetsForMatch(
  match: Match,
  bets: Bet[],
  allMatches?: Match[]
): Bet[] {
  const knownMatchIds = allMatches
    ? new Set(allMatches.map((item) => String(item.id).trim()))
    : undefined;

  return bets.filter((bet) => isBetLinkedToMatch(bet, match, { knownMatchIds }));
}

export function findBetsForMatch(match: Match, bets: Bet[], allMatches?: Match[]): Bet[] {
  const knownMatchIds = allMatches
    ? new Set(allMatches.map((item) => String(item.id).trim()))
    : undefined;

  return bets
    .filter((bet) => isBetForMatch(bet, match, { knownMatchIds }))
    .sort((a, b) => {
      const statusOrder = { WAIT: 0, WIN: 1, LOSE: 2 };
      const statusCmp = statusOrder[a.status] - statusOrder[b.status];
      if (statusCmp !== 0) return statusCmp;
      return b.amount - a.amount;
    });
}
