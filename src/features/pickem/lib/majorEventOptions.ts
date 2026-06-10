import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { PickemMajor } from "@/entities/pickem";
import { filterMajorBets } from "@/features/events/lib/isMajorEvent";
import { majorEventGroupKey } from "@/features/events/lib/majorEventStats";

export interface MajorEventOption {
  key: string;
  eventOrganization: string;
  eventName: string;
  label: string;
}

function addOption(
  map: Map<string, MajorEventOption>,
  existing: Set<string>,
  eventOrganization: string,
  eventName: string
) {
  const org = eventOrganization.trim();
  const name = eventName.trim();
  if (!org && !name) return;

  const key = majorEventGroupKey(org, name);
  if (existing.has(key) || map.has(key)) return;

  map.set(key, {
    key,
    eventOrganization: org,
    eventName: name,
    label: name ? `${org} — ${name}` : org,
  });
}

export function getMajorEventOptions(
  bets: Bet[],
  pickems: PickemMajor[],
  storedEvents: EventRecord[] = []
): MajorEventOption[] {
  const existing = new Set(
    pickems.map((item) => majorEventGroupKey(item.eventOrganization, item.eventName))
  );
  const map = new Map<string, MajorEventOption>();

  for (const bet of filterMajorBets(bets, storedEvents)) {
    addOption(map, existing, bet.eventOrganization, bet.eventName);
  }

  for (const event of storedEvents) {
    if (event.eventTier !== "Major") continue;
    addOption(map, existing, event.eventOrganization, event.eventName);
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "ru"));
}
