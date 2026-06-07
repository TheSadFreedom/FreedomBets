import { MAJOR_STAGES } from "@/entities/event";

export const PICKEM_STAGES = MAJOR_STAGES;

export type PickemStageName = (typeof PICKEM_STAGES)[number];

export const PICKEM_STAGE_RESULTS = ["played", "not_played"] as const;

export type PickemStageResult = (typeof PICKEM_STAGE_RESULTS)[number];

export const PICKEM_RESULT_LABELS: Record<PickemStageResult, string> = {
  played: "Сыграл",
  not_played: "Не сыграл",
};

export function createDefaultPickemStages() {
  return PICKEM_STAGES.map((stage) => ({
    stage,
    imageUrl: null as string | null,
    result: null as PickemStageResult | null,
  }));
}
