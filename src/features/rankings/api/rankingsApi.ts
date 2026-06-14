import type { RankingBaseline } from "@/entities/ranking";
import { httpClient } from "@/shared/api/httpClient";

export interface ImportBaselineResult {
  imported: boolean;
  baseline: RankingBaseline | null;
  teamCount?: number;
  error?: string;
}

export async function fetchRankingBaseline(): Promise<RankingBaseline | null> {
  const { data } = await httpClient.get<{ baseline: RankingBaseline | null }>("/rankings/baseline");
  return data.baseline ?? null;
}

export async function importRankingBaseline(force = false): Promise<ImportBaselineResult> {
  const { data } = await httpClient.post<ImportBaselineResult>("/rankings/import-baseline", undefined, {
    params: force ? { force: 1 } : undefined,
  });
  return data;
}
