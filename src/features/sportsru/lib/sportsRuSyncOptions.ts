import { sportsRuSyncPresets } from "@/shared/lib/date/moscowIsoDate";

export type SportsRuSyncPreset = keyof typeof sportsRuSyncPresets;

export interface SportsRuSyncRequest {
  force?: boolean;
  dates: string[];
}

export function buildSportsRuSyncRequest(preset: SportsRuSyncPreset): SportsRuSyncRequest {
  return {
    force: true,
    dates: sportsRuSyncPresets[preset](),
  };
}
