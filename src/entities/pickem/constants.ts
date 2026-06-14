export const PICKEM_STAGE_PRESETS = [
  {
    id: "challengers-legends-champions",
    stages: ["Challengers", "Legends", "Champions"],
  },
  {
    id: "stage1-stage2-playoff",
    stages: ["Stage 1", "Stage 2", "Playoff"],
  },
  {
    id: "stage1-stage2-stage3-playoff",
    stages: ["Stage 1", "Stage 2", "Stage 3", "Playoff"],
  },
] as const;

export type PickemStagePresetId = (typeof PICKEM_STAGE_PRESETS)[number]["id"];

export type PickemStageName =
  | (typeof PICKEM_STAGE_PRESETS)[number]["stages"][number]
  | string;

export const PICKEM_STAGE_RESULTS = ["played", "not_played"] as const;

export type PickemStageResult = (typeof PICKEM_STAGE_RESULTS)[number];
