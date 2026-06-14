import type { Bet } from "@/entities/bet";
import {
  AT_LEAST_ONE_MAP_LABELS,
  BET_MARKET_LABELS,
  type BetMarket,
  formatBetDescription,
  formatBetDescriptionLines,
  isBetMarket,
  mapsTotalSideLabel,
} from "@/entities/bet";
import { matchesSearchQuery } from "@/shared/lib/search/textSearch";
import { getTeamSearchTerms } from "@/shared/lib/teams/teamNames";

const BET_STATUS_SEARCH: Record<Bet["status"], string> = {
  WIN: "win выигрыш",
  LOSE: "lose проигрыш",
  WAIT: "wait ожидание",
};

const BET_MARKET_SEARCH_ALIASES: Record<BetMarket, string> = {
  match: "победа матч",
  map: "карта map",
  pistol: "пистолет пист раунд",
  mapsTotal: "тотал количество карт 2.5 меньше больше",
  atLeastOneMap: "возьмет карту хотя бы одну",
  exactScore: "точный счет счёт",
  custom: "другая ставка",
};

function getBetTypeSearchTerms(bet: Bet): string[] {
  const { market, team } = formatBetDescriptionLines(bet);
  const terms = [
    bet.betType,
    formatBetDescription(bet),
    market,
    team,
  ];

  if (isBetMarket(bet.betMarket)) {
    terms.push(BET_MARKET_LABELS[bet.betMarket], BET_MARKET_SEARCH_ALIASES[bet.betMarket]);
    if (bet.betMarket === "mapsTotal") {
      terms.push(mapsTotalSideLabel(bet.betTeam));
    }
    if (bet.betMarket === "atLeastOneMap") {
      terms.push(
        bet.yesNo === false ? AT_LEAST_ONE_MAP_LABELS.no : AT_LEAST_ONE_MAP_LABELS.yes,
      );
    }
  }

  return terms;
}

export function matchesBetSearch(bet: Bet, query: string): boolean {
  return matchesSearchQuery(
    [
      bet.date,
      bet.time,
      bet.eventOrganization,
      bet.eventName,
      bet.organization1,
      bet.organization2,
      ...getTeamSearchTerms(bet.organization1),
      ...getTeamSearchTerms(bet.organization2),
      ...getBetTypeSearchTerms(bet),
      bet.status,
      BET_STATUS_SEARCH[bet.status],
      bet.format,
      bet.majorStage,
      String(bet.amount),
      String(bet.odds),
      String(bet.mapNumber ?? ""),
      String(bet.pistolRound ?? ""),
    ],
    query
  );
}
