import type { EventRecord } from "@/entities/eventRecord";

function eventKey(event: Pick<EventRecord, "eventOrganization" | "eventName">): string {
  return `${event.eventOrganization.trim().toLowerCase()}\0${event.eventName.trim().toLowerCase()}`;
}

/** Один турнир на пару (организатор, название) — для миграции с profileId. */
export function dedupeEventRecords(events: EventRecord[]): EventRecord[] {
  const byKey = new Map<string, EventRecord>();
  for (const event of events) {
    const key = eventKey(event);
    if (!byKey.has(key)) {
      byKey.set(key, event);
    }
  }
  return Array.from(byKey.values());
}
