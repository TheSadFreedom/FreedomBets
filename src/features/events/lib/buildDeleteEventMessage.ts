import type { EventIdentity } from "@/entities/event";
import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { findBetsForEvent, findMatchesForEvent } from "@/features/events/lib/findBetsForEvent";

export function buildDeleteEventMessage(
  displayName: string,
  identity: EventIdentity,
  allBets: Bet[],
  matches: Match[],
  events: EventRecord[]
): string {
  const betsCount = findBetsForEvent(identity, allBets, events).length;
  const matchesCount = findMatchesForEvent(identity, matches).length;

  const parts: string[] = [`Турнир «${displayName}» будет удалён без возможности восстановления.`];

  if (betsCount > 0 || matchesCount > 0) {
    const details: string[] = [];
    if (betsCount > 0) {
      details.push(`${betsCount} ${betsCount === 1 ? "ставка" : betsCount < 5 ? "ставки" : "ставок"}`);
    }
    if (matchesCount > 0) {
      details.push(`${matchesCount} ${matchesCount === 1 ? "матч" : matchesCount < 5 ? "матча" : "матчей"}`);
    }
    parts.push(`Также будут удалены: ${details.join(" и ")}.`);
    parts.push("Балансы профилей будут пересчитаны.");
  }

  return parts.join(" ");
}
