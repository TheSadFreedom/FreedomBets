import type { BetMarket, MatchFormat } from "./constants";
import {
  AT_LEAST_ONE_MAP_LABELS,
  BET_MARKET_LABELS,
  BET_MARKETS,
  BO3_EXACT_SCORES,
  CUSTOM_BET_PREFIX,
  MAPS_TOTAL_SIDE_LABELS,
  getMapCount,
} from "./constants";
import { inferBetTeamFromDescription } from "@/entities/team";
import type { Bet } from "./types";

export type BetTeamSide = 1 | 2;

type BetDescriptionInput = Pick<
  Bet,
  | "betMarket"
  | "betTeam"
  | "mapNumber"
  | "pistolRound"
  | "yesNo"
  | "exactScore1"
  | "exactScore2"
  | "organization1"
  | "organization2"
  | "betType"
>;

export function isBetMarket(value: unknown): value is BetMarket {
  return typeof value === "string" && (BET_MARKETS as readonly string[]).includes(value);
}

export function isBetTeamSide(value: unknown): value is BetTeamSide {
  return value === 1 || value === 2;
}

export function isCustomBetType(betType: string): boolean {
  return /^другая\s*[—–-]\s*/i.test(betType.trim());
}

export function customBetText(betType: string): string {
  return betType.replace(/^Другая\s*[—–-]\s*/i, "").trim();
}

export function inferTeamFromLegacy(betType: string): BetTeamSide {
  const t = betType.trim();
  if (/больше/i.test(t)) return 2;
  if (/меньше/i.test(t)) return 1;
  if (/^W2$/i.test(t) || /команда\s*2|^к2$/i.test(t)) return 2;
  if (/^W1$/i.test(t) || /команда\s*1|^к1$/i.test(t)) return 1;
  if (/\b(2|втор)/i.test(t) && !/\b1\b/.test(t)) return 2;
  return 1;
}

export function inferMarketFromLegacy(betType: string): BetMarket {
  if (isCustomBetType(betType)) return "custom";
  const t = betType.toLowerCase();
  if (t.includes("пист")) return "pistol";
  if (t.includes("количество карт") || t.includes("тотал карт") || /2[,.]5/.test(t)) {
    return "mapsTotal";
  }
  if (t.includes("возьмёт карту") || t.includes("хотя бы одну карту")) {
    return "atLeastOneMap";
  }
  if (t.includes("точный сч")) return "exactScore";
  if (t.includes("карт") || /\bk\.?\s*\d/i.test(t)) return "map";
  return "match";
}

export function mapsTotalSideLabel(betTeam: BetTeamSide): string {
  return betTeam === 2 ? MAPS_TOTAL_SIDE_LABELS.over : MAPS_TOTAL_SIDE_LABELS.under;
}

export function atLeastOneMapSideLabel(yesNo: boolean): string {
  return yesNo ? AT_LEAST_ONE_MAP_LABELS.yes : AT_LEAST_ONE_MAP_LABELS.no;
}

export function inferYesNoFromLegacy(betType: string): boolean {
  return !/\bнет\b/i.test(betType);
}

export function formatExactScoreLabel(score1: number, score2: number): string {
  return `${score1}:${score2}`;
}

export function isBo3ExactScore(score1: number, score2: number): boolean {
  return BO3_EXACT_SCORES.some((score) => score.score1 === score1 && score.score2 === score2);
}

export function normalizeBo3ExactScore(
  score1: number | null | undefined,
  score2: number | null | undefined
): (typeof BO3_EXACT_SCORES)[number] {
  const fallback = BO3_EXACT_SCORES[0];
  if (score1 == null || score2 == null) return fallback;
  return BO3_EXACT_SCORES.find((score) => score.score1 === score1 && score.score2 === score2) ?? fallback;
}

export function inferExactScoreFromLegacy(
  betType: string
): (typeof BO3_EXACT_SCORES)[number] {
  const match = betType.match(/(\d)\s*[:\-–]\s*(\d)/);
  if (!match) return BO3_EXACT_SCORES[0];
  return normalizeBo3ExactScore(Number(match[1]), Number(match[2]));
}

export function exactScoreWinnerSide(score1: number, score2: number): BetTeamSide {
  return score1 > score2 ? 1 : 2;
}

export function teamLabel(
  bet: Pick<Bet, "betTeam" | "organization1" | "organization2">
): string {
  const name = bet.betTeam === 2 ? bet.organization2 : bet.organization1;
  return (name ?? "").trim() || (bet.betTeam === 2 ? "Команда 2" : "Команда 1");
}

export interface BetDescriptionLines {
  market: string;
  team: string;
}

export function formatBetDescriptionLines(bet: BetDescriptionInput): BetDescriptionLines {
  const betMarket = isBetMarket(bet.betMarket)
    ? bet.betMarket
    : inferMarketFromLegacy(bet.betType ?? "");
  const betTeam = isBetTeamSide(bet.betTeam)
    ? bet.betTeam
    : inferBetTeamFromDescription(
        bet.betType ?? "",
        bet.organization1 ?? "",
        bet.organization2 ?? "",
      );
  const team = teamLabel({ ...bet, betTeam });

  let market: string;
  switch (betMarket) {
    case "match":
      market = BET_MARKET_LABELS.match;
      break;
    case "map":
      market = `Карта ${bet.mapNumber ?? "?"}`;
      break;
    case "pistol":
      market = `Карта ${bet.mapNumber ?? "?"}, пист. ${bet.pistolRound ?? "?"}`;
      break;
    case "mapsTotal":
      market = BET_MARKET_LABELS.mapsTotal;
      return { market, team: mapsTotalSideLabel(betTeam) };
    case "atLeastOneMap":
      market = BET_MARKET_LABELS.atLeastOneMap;
      return {
        market,
        team: `${team} — ${atLeastOneMapSideLabel(bet.yesNo === true)}`,
      };
    case "exactScore": {
      market = BET_MARKET_LABELS.exactScore;
      const score = normalizeBo3ExactScore(bet.exactScore1, bet.exactScore2);
      return { market, team: formatExactScoreLabel(score.score1, score.score2) };
    }
    case "custom": {
      const text = customBetText(bet.betType ?? "").trim();
      if (text) {
        return { market: `${CUSTOM_BET_PREFIX}${text}`, team: "" };
      }
      return { market: BET_MARKET_LABELS.custom, team: "" };
    }
  }

  return { market, team };
}

export function formatBetDescription(bet: BetDescriptionInput): string {
  if (bet.betMarket === "custom") {
    const text = customBetText(bet.betType ?? "").trim();
    return text ? `${CUSTOM_BET_PREFIX}${text}` : BET_MARKET_LABELS.custom;
  }
  const { market, team } = formatBetDescriptionLines(bet);
  return `${market} — ${team}`;
}

export function clampMapNumber(
  format: MatchFormat,
  mapNumber: number | null | undefined
): number {
  const max = getMapCount(format);
  const n = mapNumber ?? 1;
  return Math.min(max, Math.max(1, n));
}

export function normalizeBetTargets(
  bet: Pick<
    Bet,
    "betMarket" | "mapNumber" | "pistolRound" | "yesNo" | "exactScore1" | "exactScore2" | "format"
  >
): Pick<Bet, "mapNumber" | "pistolRound" | "yesNo" | "exactScore1" | "exactScore2"> {
  if (bet.betMarket === "exactScore") {
    const score = normalizeBo3ExactScore(bet.exactScore1, bet.exactScore2);
    return {
      mapNumber: null,
      pistolRound: null,
      yesNo: null,
      exactScore1: score.score1,
      exactScore2: score.score2,
    };
  }

  if (
    bet.betMarket === "match" ||
    bet.betMarket === "mapsTotal" ||
    bet.betMarket === "atLeastOneMap" ||
    bet.betMarket === "custom"
  ) {
    return {
      mapNumber: null,
      pistolRound: null,
      yesNo: bet.betMarket === "atLeastOneMap" ? (bet.yesNo ?? true) : null,
      exactScore1: null,
      exactScore2: null,
    };
  }
  const mapNumber = clampMapNumber(bet.format, bet.mapNumber);
  const pistolRound = bet.betMarket === "pistol" ? (bet.pistolRound === 2 ? 2 : 1) : null;
  return { mapNumber, pistolRound, yesNo: null, exactScore1: null, exactScore2: null };
}
