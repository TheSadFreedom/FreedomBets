import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { PickemMajor } from "@/entities/pickem";
import { filterMajorBets } from "@/features/events/lib/isMajorEvent";
import { eventGroupKey } from "@/features/events/lib/eventGroupKey";
import { mergeEventTitle } from "@/features/events/lib/eventTitle";

export interface MajorEventOption {
  key: string;
  eventName: string;
  label: string;
  eventId?: string;
}

function addOption(
  map: Map<string, MajorEventOption>,
  existing: Set<string>,
  eventName: string,
  eventId?: string
) {
  const name = eventName.trim();
  if (!name) return;

  const key = eventGroupKey(name);
  if (existing.has(key) || map.has(key)) return;

  map.set(key, {
    key,
    eventName: name,
    eventId,
    label: mergeEventTitle("", name),
  });
}

export function getMajorEventOptions(
  bets: Bet[],
  pickems: PickemMajor[],
  storedEvents: EventRecord[] = []
): MajorEventOption[] {
  const existing = new Set(pickems.map((item) => eventGroupKey(item.eventName)));
  const map = new Map<string, MajorEventOption>();

  for (const bet of filterMajorBets(bets, storedEvents)) {
    addOption(map, existing, bet.eventName, bet.eventId);
  }

  for (const event of storedEvents) {
    if (!/major/i.test(event.name)) continue;
    addOption(map, existing, event.name, event.id);
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "ru"));
}
