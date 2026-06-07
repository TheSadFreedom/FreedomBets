export const BET_STATUSES = ["WAIT", "WIN", "LOSE"] as const;
export type BetStatus = (typeof BET_STATUSES)[number];

const LEGACY_STATUS_MAP: Record<string, BetStatus> = {
  ожидание: "WAIT",
  выигрыш: "WIN",
  проигрыш: "LOSE",
  WAIT: "WAIT",
  WIN: "WIN",
  LOSE: "LOSE",
};

export function normalizeBetStatus(status: string): BetStatus {
  return LEGACY_STATUS_MAP[status] ?? "WAIT";
}

export const MATCH_FORMATS = ["BO1", "BO3", "BO5"] as const;
export type MatchFormat = (typeof MATCH_FORMATS)[number];

export const MATCH_FORMAT_META: Record<
  MatchFormat,
  { maps: number; label: string; description: string }
> = {
  BO1: {
    maps: 1,
    label: "BO1",
    description: "1 карта · 2 пистолетных раунда на карте",
  },
  BO3: {
    maps: 3,
    label: "BO3",
    description: "до 3 карт · 2 пистолетных раунда на каждой карте",
  },
  BO5: {
    maps: 5,
    label: "BO5",
    description: "до 5 карт · 2 пистолетных раунда на каждой карте",
  },
};

export const BET_MARKETS = ["match", "map", "pistol"] as const;
export type BetMarket = (typeof BET_MARKETS)[number];

export const BET_MARKET_LABELS: Record<BetMarket, string> = {
  match: "Победа в матче",
  map: "Победа на карте",
  pistol: "Победа в пистолетном раунде",
};

export const PISTOL_ROUNDS_PER_MAP = 2;

export function getMapCount(format: MatchFormat): number {
  return MATCH_FORMAT_META[format].maps;
}
