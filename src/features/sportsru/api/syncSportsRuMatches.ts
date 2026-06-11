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
    blocked?: boolean;
    error?: string;
  };
}

export async function syncSportsRuMatches(force = false): Promise<SportsRuSyncResult> {
  const { data } = await httpClient.post<SportsRuSyncResult>("/sportsru/sync", undefined, {
    params: force ? { refresh: 1 } : undefined,
  });
  return data;
}
