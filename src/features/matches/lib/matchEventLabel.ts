import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { storedEventTitle } from "@/features/events/lib/eventTitle";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { formatEventLabel } from "@/features/events/lib/eventDisplay";

export function getMatchEventLabel(match: Match, events: EventRecord[] = []): string {
  const stored = findStoredEvent(
    { id: match.eventId, name: match.eventName ?? "" },
    events,
  );
  const name = stored ? storedEventTitle(stored) : (match.eventName ?? "").trim();
  return name ? formatEventLabel("", name) : "Без турнира";
}
