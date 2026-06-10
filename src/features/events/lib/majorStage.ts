import type { EventTier, MajorStage } from "@/entities/event";
import { isMajorStage, MAJOR_STAGES } from "@/entities/event";

const STAGE_PATTERNS: { pattern: RegExp; stage: MajorStage }[] = [
  { pattern: /\bplayoffs?\b/i, stage: "Playoff" },
  { pattern: /\bstage\s*3\b/i, stage: "Stage 3" },
  { pattern: /\bstage\s*2\b/i, stage: "Stage 2" },
  { pattern: /\bstage\s*1\b/i, stage: "Stage 1" },
];

export function parseMajorFromEventName(eventName: string): {
  baseName: string;
  stage: MajorStage | null;
} {
  const trimmed = eventName.trim();
  for (const { pattern, stage } of STAGE_PATTERNS) {
    if (!pattern.test(trimmed)) continue;
    const baseName = trimmed
      .replace(pattern, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s*[-–—]\s*$/g, "")
      .trim();
    return { baseName: baseName || trimmed, stage };
  }
  return { baseName: trimmed, stage: null };
}

export function resolveMajorStage(
  value: unknown,
  eventTier: EventTier,
  eventName: string
): MajorStage | null {
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    return isMajorStage(trimmed) ? trimmed : null;
  }
  if (eventTier !== "Major") return null;
  return parseMajorFromEventName(eventName).stage;
}

export function resolveEventStage(
  value: unknown,
  eventTier: EventTier,
  eventName: string
): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (eventTier === "Major") return parseMajorFromEventName(eventName).stage;
  return null;
}

export function formatMajorStageLabel(stage: string | null | undefined): string {
  return stage ?? "";
}

export const majorStageStyles: Record<
  MajorStage,
  { color: string; bg: string; border: string }
> = {
  "Stage 1": {
    color: "#ce93d8",
    bg: "rgba(156, 39, 176, 0.14)",
    border: "rgba(156, 39, 176, 0.35)",
  },
  "Stage 2": {
    color: "#b39ddb",
    bg: "rgba(103, 58, 183, 0.14)",
    border: "rgba(103, 58, 183, 0.35)",
  },
  "Stage 3": {
    color: "#9fa8da",
    bg: "rgba(63, 81, 181, 0.14)",
    border: "rgba(63, 81, 181, 0.35)",
  },
  Playoff: {
    color: "#ffcc80",
    bg: "rgba(255, 167, 38, 0.18)",
    border: "rgba(255, 167, 38, 0.42)",
  },
};

export { MAJOR_STAGES };
