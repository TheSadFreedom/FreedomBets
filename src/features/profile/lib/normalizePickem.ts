import type { Pickem, PickemStage } from "@/entities/pickem";
import { PICKEM_STAGE_RESULTS, type PickemStageResult } from "@/entities/pickem";
import { limitInputLength, MAX_EVENT_NAME_LENGTH } from "@/shared/lib/limits";

function isPickemStageResult(value: unknown): value is PickemStageResult {
  return typeof value === "string" && PICKEM_STAGE_RESULTS.includes(value as PickemStageResult);
}

function normalizeImageUrl(data: Partial<PickemStage> & { imageData?: unknown }): string | null {
  if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
    return data.imageUrl.trim();
  }
  if (typeof data.imageData === "string" && data.imageData.trim()) {
    return data.imageData.trim();
  }
  return null;
}

function normalizeStage(data: Partial<PickemStage>): PickemStage | null {
  const stage = typeof data.stage === "string" ? data.stage.trim() : "";
  if (!stage) return null;

  return {
    stage,
    imageUrl: normalizeImageUrl(data),
    result: isPickemStageResult(data.result) ? data.result : null,
  };
}

function normalizeStages(data: Pickem & { stages?: unknown }): PickemStage[] {
  if (Array.isArray(data.stages)) {
    const result: PickemStage[] = [];
    const seen = new Set<string>();

    for (const item of data.stages) {
      if (!item || typeof item !== "object") continue;
      const normalized = normalizeStage(item as Partial<PickemStage>);
      if (!normalized || seen.has(normalized.stage)) continue;
      seen.add(normalized.stage);
      result.push(normalized);
    }

    if (result.length > 0) return result;
  }

  const legacyUrl =
    typeof data.imageUrl === "string" && data.imageUrl.trim() ? data.imageUrl.trim() : null;
  if (legacyUrl) {
    return [{ stage: "Pick'em", imageUrl: legacyUrl, result: null }];
  }

  return [];
}

export function normalizePickem(data: Pickem): Pickem {
  return {
    id: String(data.id),
    profileId: Number(data.profileId),
    eventName: limitInputLength(String(data.eventName ?? "").trim(), MAX_EVENT_NAME_LENGTH),
    stages: normalizeStages(data),
  };
}

/** @deprecated */
export const normalizePickemMajor = normalizePickem;
