import type { EventRecord } from "@/entities/eventRecord";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";

export function isEventFinished(
  eventId: string,
  eventName: string,
  storedEvents: EventRecord[],
  today = todayIsoDateLocal()
): boolean {
  const record = findStoredEvent({ id: eventId, name: eventName }, storedEvents);
  const endDate = record?.endDate?.trim() ?? "";
  if (!endDate) return false;
  return endDate < today;
}
