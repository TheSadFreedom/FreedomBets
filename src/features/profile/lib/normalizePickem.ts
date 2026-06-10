import type { PickemMajor, PickemStageData } from "@/entities/pickem";
import {
  PICKEM_STAGE_RESULTS,
  createDefaultPickemStages,
  type PickemStageResult,
} from "@/entities/pickem";

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

function normalizeStage(data: Partial<PickemStageData>): PickemStageData | null {
  const stage = typeof data.stage === "string" ? data.stage.trim() : "";
  if (!stage) return null;

  return {
    stage,
    imageUrl: normalizeImageUrl(data),
    result: isPickemStageResult(data.result) ? data.result : null,
  };
}

function normalizeStages(stages: unknown): PickemStageData[] {
  if (!Array.isArray(stages)) return createDefaultPickemStages();

  const result: PickemStageData[] = [];
  const seen = new Set<string>();

  for (const item of stages) {
    if (!item || typeof item !== "object") continue;
    const normalized = normalizeStage(item as Partial<PickemStageData>);
    if (!normalized || seen.has(normalized.stage)) continue;
    seen.add(normalized.stage);
    result.push(normalized);
  }

  return result.length > 0 ? result : createDefaultPickemStages();
}

export function normalizePickemMajor(data: PickemMajor): PickemMajor {
  return {
    ...data,
    eventOrganization: (data.eventOrganization ?? "").trim(),
    eventName: (data.eventName ?? "").trim(),
    stages: normalizeStages(data.stages),
  };
}
