import { httpClient } from "@/shared/api/httpClient";

export interface SportsRuSyncResult {
  created: number;
  updated: number;
  total: number;
  betsRecalculated?: number;
  error?: string;
  meta?: {
    fetchedAt?: string;
    syncedAt?: string;
    knownEventCount?: number;
    parsedCount?: number;
    blocked?: boolean;
    error?: string;
  };
}

export interface SportsRuSyncOptions {
  force?: boolean;
  dates?: string[];
}

export async function syncSportsRuMatches(
  options: SportsRuSyncOptions = {},
): Promise<SportsRuSyncResult> {
  const { force = false, dates } = options;
  const params: Record<string, string> = {};

  if (force) {
    params.refresh = "1";
  }

  if (dates?.length) {
    params.dates = dates.join(",");
  }

  const { data } = await httpClient.post<SportsRuSyncResult>("/sportsru/sync", undefined, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
  return data;
}
