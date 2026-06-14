export interface RankingBaselineTeam {
  teamKey: string;
  teamName: string;
  globalRank: number;
  points: number;
  roster?: string;
}

export interface RankingBaseline {
  snapshotDate: string;
  importedAt: string;
  source: string;
  sourceFile?: string;
  teams: RankingBaselineTeam[];
}

export interface RankingsState {
  baseline: RankingBaseline | null;
}
