import type { BetMarket, MatchFormat } from "./constants";
import { BET_MARKET_LABELS, BET_MARKETS, getMapCount } from "./constants";
import type { Bet } from "./types";

export type BetTeamSide = 1 | 2;

type BetDescriptionInput = Pick<
  Bet,
  | "betMarket"
  | "betTeam"
  | "mapNumber"
  | "pistolRound"
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

export function inferTeamFromLegacy(betType: string): BetTeamSide {
  const t = betType.trim();
  if (/^W2$/i.test(t) || /команда\s*2|^к2$/i.test(t)) return 2;
  if (/^W1$/i.test(t) || /команда\s*1|^к1$/i.test(t)) return 1;
  if (/\b(2|втор)/i.test(t) && !/\b1\b/.test(t)) return 2;
  return 1;
}

export function inferMarketFromLegacy(betType: string): BetMarket {
  const t = betType.toLowerCase();
  if (t.includes("пист")) return "pistol";
  if (t.includes("карт") || /\bk\.?\s*\d/i.test(t)) return "map";
  return "match";
}

export function teamLabel(
  bet: Pick<Bet, "betTeam" | "organization1" | "organization2">
): string {
  const name = bet.betTeam === 2 ? bet.organization2 : bet.organization1;
  return name.trim() || (bet.betTeam === 2 ? "Команда 2" : "Команда 1");
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
    : inferTeamFromLegacy(bet.betType ?? "");
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
  }

  return { market, team };
}

export function formatBetDescription(bet: BetDescriptionInput): string {
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
  bet: Pick<Bet, "betMarket" | "mapNumber" | "pistolRound" | "format">
): Pick<Bet, "mapNumber" | "pistolRound"> {
  if (bet.betMarket === "match") {
    return { mapNumber: null, pistolRound: null };
  }
  const mapNumber = clampMapNumber(bet.format, bet.mapNumber);
  const pistolRound = bet.betMarket === "pistol" ? (bet.pistolRound === 2 ? 2 : 1) : null;
  return { mapNumber, pistolRound };
}
