import type { EventRecord } from "@/entities/eventRecord";
import { storedEventTitle } from "@/features/events/lib/eventTitle";

function eventKey(event: EventRecord): string {
  const name = event.name || event.eventName || "";
  return (event.id || storedEventTitle({ name })).toLowerCase();
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
