import type { EventRecord } from "@/entities/eventRecord";
import { isEventTier } from "@/entities/event";

export function normalizeEventRecord(data: EventRecord): EventRecord {
  return {
    ...data,
    id: String(data.id),
    profileId: Number(data.profileId),
    eventOrganization: (data.eventOrganization ?? "").trim(),
    eventName: (data.eventName ?? "").trim(),
    date: (data.date ?? "").trim(),
    endDate: (data.endDate ?? "").trim(),
    eventTier: isEventTier(data.eventTier) ? data.eventTier : "Small",
  };
}
