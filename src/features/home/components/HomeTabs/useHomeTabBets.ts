import { useMemo } from "react";
import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import {
  filterBetsByTier,
  filterMajorBets,
  filterNonMajorBets,
} from "@/features/events/lib/isMajorEvent";

export function useHomeTabBets(
  bets: Bet[],
  events: EventRecord[],
  mountedTabs: ReadonlySet<number>,
) {
  const eventsTabMounted = mountedTabs.has(5);
  const majorsTabMounted = mountedTabs.has(6);

  const majorBets = useMemo(
    () => (majorsTabMounted ? filterMajorBets(bets, events) : []),
    [bets, events, majorsTabMounted],
  );
  const nonMajorBets = useMemo(
    () => (eventsTabMounted ? filterNonMajorBets(bets, events) : []),
    [bets, events, eventsTabMounted],
  );
  const bigBets = useMemo(
    () => (eventsTabMounted ? filterBetsByTier(nonMajorBets, "Big", events) : []),
    [nonMajorBets, events, eventsTabMounted],
  );
  const smallBets = useMemo(
    () => (eventsTabMounted ? filterBetsByTier(nonMajorBets, "Small", events) : []),
    [nonMajorBets, events, eventsTabMounted],
  );

  return { majorBets, nonMajorBets, bigBets, smallBets };
}
