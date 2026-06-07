import type { PickemMajor, PickemStageData } from "@/entities/pickem";
import {
  PICKEM_STAGE_RESULTS,
  PICKEM_STAGES,
  createDefaultPickemStages,
  type PickemStageName,
  type PickemStageResult,
} from "@/entities/pickem";

function isPickemStageName(value: unknown): value is PickemStageName {
  return typeof value === "string" && PICKEM_STAGES.includes(value as PickemStageName);
}

function isPickemStageResult(value: unknown): value is PickemStageResult {
  return typeof value === "string" && PICKEM_STAGE_RESULTS.includes(value as PickemStageResult);
}

function normalizeImageUrl(data: Partial<PickemStageData> & { imageData?: unknown }): string | null {
  if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
    return data.imageUrl.trim();
  }

  if (typeof data.imageData === "string" && data.imageData.trim()) {
    return data.imageData.trim();
  }

  return null;
}

function normalizeStage(data: Partial<PickemStageData>, fallbackStage: PickemStageName): PickemStageData {
  const stage = isPickemStageName(data.stage) ? data.stage : fallbackStage;
  const imageUrl = normalizeImageUrl(data);
  const result = isPickemStageResult(data.result) ? data.result : null;

  return { stage, imageUrl, result };
}

function normalizeStages(stages: unknown): PickemStageData[] {
  if (!Array.isArray(stages)) return createDefaultPickemStages();

  const byStage = new Map<PickemStageName, PickemStageData>();
  for (const item of stages) {
    if (!item || typeof item !== "object") continue;
    const normalized = normalizeStage(item as Partial<PickemStageData>, "Stage 1");
    byStage.set(normalized.stage, normalized);
  }

  return PICKEM_STAGES.map(
    (stage) => byStage.get(stage) ?? { stage, imageUrl: null, result: null }
  );
}

export function normalizePickemMajor(data: PickemMajor): PickemMajor {
  return {
    ...data,
    eventOrganization: (data.eventOrganization ?? "").trim(),
    eventName: (data.eventName ?? "").trim(),
    stages: normalizeStages(data.stages),
  };
}
