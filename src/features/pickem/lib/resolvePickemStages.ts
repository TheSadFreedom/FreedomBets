import { PICKEM_STAGES } from "@/entities/pickem";
import type { PickemMajor, PickemStageData } from "@/entities/pickem";
import type { EventRecord } from "@/entities/eventRecord";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { resolveEventStages } from "@/features/events/lib/eventStages";

export function resolvePickemStageNames(
  eventOrganization: string,
  eventName: string,
  events: EventRecord[] = []
): string[] {
  const stored = findStoredEvent({ eventOrganization, eventName }, events);
  const configured = resolveEventStages(stored);
  return configured.length > 0 ? configured : [...PICKEM_STAGES];
}

export function resolvePickemStagesForMajor(
  major: PickemMajor,
  events: EventRecord[] = []
): PickemStageData[] {
  const stageNames = resolvePickemStageNames(major.eventOrganization, major.eventName, events);
  const byStage = new Map<string, PickemStageData>();

  for (const item of major.stages) {
    const name = item.stage.trim();
    if (!name) continue;
    byStage.set(name, item);
  }

  const ordered = stageNames.map(
    (stage) => byStage.get(stage) ?? { stage, imageUrl: null, result: null }
  );

  const configuredSet = new Set(stageNames);
  const extras = major.stages.filter(
    (item) => item.stage.trim() && !configuredSet.has(item.stage.trim())
  );

  return extras.length > 0 ? [...ordered, ...extras] : ordered;
}
