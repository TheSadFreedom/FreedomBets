import { lazy } from "react";

export const LazyMatchesTab = lazy(
  () => import("@/features/matches/components/MatchesTab/MatchesTab"),
);
export const LazyBetsHistory = lazy(
  () => import("@/features/bets/components/BetsHistory/BetsHistory"),
);
export const LazyStatsSummary = lazy(
  () => import("@/features/summary/components/StatsSummary/StatsSummary"),
);
export const LazyProfileRankingTab = lazy(
  () => import("@/features/profile/components/ProfileRankingTab/ProfileRankingTab"),
);
export const LazyTeamsTab = lazy(() => import("@/features/teams/components/TeamsTab/TeamsTab"));
export const LazyEventStats = lazy(
  () => import("@/features/events/components/EventStats/EventStats"),
);
export const LazyPickemTab = lazy(() => import("@/features/pickem/components/PickemTab/PickemTab"));
