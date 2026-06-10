import type { EventRecord } from "@/entities/eventRecord";
import { isEventTier } from "@/entities/event";
import { normalizeEventStagesList } from "@/features/events/lib/eventStages";
import { limitInputLength } from "@/shared/lib/limits";

export function normalizeEventRecord(data: EventRecord & { profileId?: unknown }): EventRecord {
  return {
    id: String(data.id),
    eventOrganization: limitInputLength((data.eventOrganization ?? "").trim()),
    eventName: limitInputLength((data.eventName ?? "").trim()),
    logoSlug:
      typeof data.logoSlug === "string" && data.logoSlug.trim() ? data.logoSlug.trim() : null,
    date: (data.date ?? "").trim(),
    endDate: (data.endDate ?? "").trim(),
    eventTier: isEventTier(data.eventTier) ? data.eventTier : "Small",
    stages: normalizeEventStagesList(data.stages).map((stage) => limitInputLength(stage)),
    winnerOrganization:
      typeof data.winnerOrganization === "string" && data.winnerOrganization.trim()
        ? limitInputLength(data.winnerOrganization.trim())
        : null,
    winnerLogoSlug:
      typeof data.winnerOrganization === "string" &&
      data.winnerOrganization.trim() &&
      typeof data.winnerLogoSlug === "string" &&
      data.winnerLogoSlug.trim()
        ? data.winnerLogoSlug.trim()
        : null,
  };
}
