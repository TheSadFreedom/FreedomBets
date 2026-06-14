import type { Bet, StoredBet } from "@/entities/bet";
import {
  formatBetDescription,
  inferExactScoreFromLegacy,
  inferMarketFromLegacy,
  inferYesNoFromLegacy,
  isBetMarket,
  isBetTeamSide,
  normalizeBetTargets,
} from "@/entities/bet";
import type { Match } from "@/entities/match";
import type { Tournament } from "@/entities/eventRecord";
import type { Team } from "@/entities/team";
import { betTeamOnMatchSide, inferBetTeamFromDescription, resolveBetTeamId } from "@/entities/team";
import { resolveTeamDisplayName } from "@/shared/lib/teams/resolveTeamDisplayName";

function resolveTournament(
  match: Match | null,
  tournamentsById: Map<string, Tournament>,
  tournaments: Tournament[]
): Tournament | undefined {
  if (!match) return undefined;

  const eventId = match.eventId?.trim();
  if (eventId) {
    const byId = tournamentsById.get(eventId);
    if (byId) return byId;
  }

  const legacyName = match.eventName?.trim().toLowerCase();
  if (!legacyName) return undefined;

  return tournaments.find((item) => item.name.trim().toLowerCase() === legacyName);
}

export function enrichBet(
  stored: StoredBet,
  match: Match | null,
  teamsById: Map<string, Team>,
  tournamentsById: Map<string, Tournament>,
  tournaments: Tournament[] = []
): Bet {
  const betType = stored.betType ?? "";
  const betMarket = inferMarketFromLegacy(betType);

  const team1Id = match?.team1Id ?? "";
  const team2Id = match?.team2Id ?? "";
  const organization1 = resolveTeamDisplayName(
    team1Id,
    match?.organization1,
    teamsById
  );
  const organization2 = resolveTeamDisplayName(
    team2Id,
    match?.organization2,
    teamsById
  );

  const betTeam = inferBetTeamFromDescription(betType, organization1, organization2);

  const tournament = resolveTournament(match, tournamentsById, tournaments);
  const eventId = match?.eventId?.trim() || tournament?.id || "";
  const eventName = tournament?.name || match?.eventName?.trim() || "";

  const draft: Bet = {
    ...stored,
    matchId: stored.matchId?.trim() ?? "",
    format: match?.format ?? "BO3",
    team1Id,
    team2Id,
    organization1,
    organization2,
    eventId,
    eventName,
    betMarket: isBetMarket(betMarket) ? betMarket : "match",
    betTeam: isBetTeamSide(betTeam) ? betTeam : 1,
    betTeamId: null,
    mapNumber: betMarket === "map" || betMarket === "pistol" ? 1 : null,
    pistolRound: betMarket === "pistol" ? 1 : null,
    yesNo: betMarket === "atLeastOneMap" ? inferYesNoFromLegacy(betType) : null,
    exactScore1:
      betMarket === "exactScore" ? inferExactScoreFromLegacy(betType).score1 : null,
    exactScore2:
      betMarket === "exactScore" ? inferExactScoreFromLegacy(betType).score2 : null,
    betType,
  };

  const targets = normalizeBetTargets(draft);
  const withTargets = { ...draft, ...targets };
  const resolvedMarket = isBetMarket(betMarket) ? betMarket : "match";
  return {
    ...withTargets,
    betTeamId: resolveBetTeamId(withTargets),
    betType:
      resolvedMarket === "custom"
        ? stored.betType
        : formatBetDescription({ ...withTargets, betMarket: resolvedMarket }),
  };
}

export function enrichBets(
  stored: StoredBet[],
  matches: Match[],
  teams: Team[],
  tournaments: Tournament[]
): Bet[] {
  const matchesById = new Map(matches.map((item) => [item.id, item]));
  const teamsById = new Map(teams.map((item) => [item.id, item]));
  const tournamentsById = new Map(tournaments.map((item) => [item.id, item]));

  return stored.map((item) =>
    enrichBet(
      item,
      matchesById.get(item.matchId) ?? null,
      teamsById,
      tournamentsById,
      tournaments
    )
  );
}

export function toStoredBet(bet: Pick<Bet, keyof StoredBet>): StoredBet {
  return {
    id: bet.id,
    profileId: bet.profileId,
    date: bet.date,
    time: bet.time,
    matchId: bet.matchId,
    status: bet.status,
    amount: bet.amount,
    odds: bet.odds,
    betType: bet.betType,
  };
}

/** Для settlement: betTeam на стороне матча */
export { betTeamOnMatchSide };
