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

export const BET_MARKETS = [
  "match",
  "map",
  "pistol",
  "mapsTotal",
  "atLeastOneMap",
  "exactScore",
] as const;
export type BetMarket = (typeof BET_MARKETS)[number];

export const MAPS_TOTAL_LINE = 2.5;

export const BET_MARKET_LABELS: Record<BetMarket, string> = {
  match: "Победа в матче",
  map: "Победа на карте",
  pistol: "Победа в пистолетном раунде",
  mapsTotal: "Количество карт",
  atLeastOneMap: "Возьмёт карту",
  exactScore: "Точный счёт",
};

/** Допустимые счета серии в BO3. */
export const BO3_EXACT_SCORES = [
  { score1: 2, score2: 0 },
  { score1: 2, score2: 1 },
  { score1: 0, score2: 2 },
  { score1: 1, score2: 2 },
] as const;

export type Bo3ExactScore = (typeof BO3_EXACT_SCORES)[number];

export const AT_LEAST_ONE_MAP_LABELS = {
  yes: "Да",
  no: "Нет",
} as const;

export const MAPS_TOTAL_SIDE_LABELS = {
  under: `меньше ${MAPS_TOTAL_LINE.toLocaleString("ru-RU")}`,
  over: `больше ${MAPS_TOTAL_LINE.toLocaleString("ru-RU")}`,
} as const;

export const PISTOL_ROUNDS_PER_MAP = 2;

export function getMapCount(format: MatchFormat): number {
  return MATCH_FORMAT_META[format].maps;
}
