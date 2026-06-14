import {
  PICKEM_STAGE_PRESETS,
  type PickemStageName,
  type PickemStagePresetId,
} from "@/entities/pickem";
import type { PickemStage } from "@/entities/pickem";

export function getPickemStagePreset(presetId: PickemStagePresetId) {
  return PICKEM_STAGE_PRESETS.find((preset) => preset.id === presetId);
}

export function createPickemStagesForPreset(presetId: PickemStagePresetId): PickemStage[] {
  const preset = getPickemStagePreset(presetId);
  if (!preset) {
    throw new Error(`Unknown pick'em stage preset: ${presetId}`);
  }

  return preset.stages.map((stage) => ({
    stage,
    imageUrl: null,
    result: null,
  }));
}

export function formatPresetLabel(presetId: PickemStagePresetId): string {
  const preset = getPickemStagePreset(presetId);
  return preset ? preset.stages.join(" · ") : "";
}

const STAGE_BORDER: Record<string, string> = {
  Challengers: "rgba(171, 71, 188, 0.8)",
  Legends: "rgba(100, 181, 246, 0.8)",
  Champions: "rgba(255, 213, 79, 0.85)",
  "Stage 1": "rgba(129, 199, 132, 0.75)",
  "Stage 2": "rgba(100, 181, 246, 0.75)",
  "Stage 3": "rgba(255, 213, 79, 0.75)",
  Playoff: "rgba(255, 167, 38, 0.9)",
};

export function stageAccent(stage: PickemStageName): string {
  return STAGE_BORDER[stage] ?? "rgba(255, 255, 255, 0.16)";
}
