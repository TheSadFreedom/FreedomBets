import type { EventRecord } from "@/entities/eventRecord";
import { isEventTier } from "@/entities/event";

export function normalizeEventRecord(data: EventRecord & { profileId?: unknown }): EventRecord {
  return {
    id: String(data.id),
    eventOrganization: (data.eventOrganization ?? "").trim(),
    eventName: (data.eventName ?? "").trim(),
    date: (data.date ?? "").trim(),
    endDate: (data.endDate ?? "").trim(),
    eventTier: isEventTier(data.eventTier) ? data.eventTier : "Small",
  };
}
