export const MAJOR_STAGES = ["Stage 1", "Stage 2", "Stage 3", "Playoff"] as const;

export type MajorStage = (typeof MAJOR_STAGES)[number];

export function isMajorStage(value: unknown): value is MajorStage {
  return typeof value === "string" && MAJOR_STAGES.includes(value as MajorStage);
}
