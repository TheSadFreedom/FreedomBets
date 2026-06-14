import type { RankingBaseline } from "@/entities/ranking";
import { buildTeamRankings } from "@/features/rankings/lib/buildTeamRankings";
import { httpClient } from "@/shared/api/httpClient";

export interface ImportBaselineResult {
  imported: boolean;
  baseline: RankingBaseline | null;
  teamCount?: number;
  error?: string;
}

function normalizeBaseline(baseline: RankingBaseline | null): RankingBaseline | null {
  if (!baseline) return null;
  return {
    ...baseline,
    teams: buildTeamRankings(baseline),
  };
}

export async function fetchRankingBaseline(): Promise<RankingBaseline | null> {
  const { data } = await httpClient.get<{ baseline: RankingBaseline | null }>("/rankings/baseline");
  return normalizeBaseline(data.baseline ?? null);
}

export async function importRankingBaseline(force = false): Promise<ImportBaselineResult> {
  const { data } = await httpClient.post<ImportBaselineResult>("/rankings/import-baseline", undefined, {
    params: force ? { force: 1 } : undefined,
  });
  return {
    ...data,
    baseline: normalizeBaseline(data.baseline ?? null),
  };
}
