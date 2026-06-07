import type { EventStats } from "@/entities/event";

export type EventStatsSortField =
  | "date"
  | "name"
  | "totalBets"
  | "winRate"
  | "profit"
  | "pendingExposure";

export type SortDirection = "asc" | "desc";

function eventNameKey(item: EventStats): string {
  return `${item.eventOrganization} ${item.eventName}`.trim();
}


function compareWinRate(a: EventStats, b: EventStats): number {
  const aSettled = a.wins + a.losses;
  const bSettled = b.wins + b.losses;
  if (aSettled === 0 && bSettled === 0) return 0;
  if (aSettled === 0) return -1;
  if (bSettled === 0) return 1;
  return a.winRate - b.winRate;
}

export function sortEventStatsList(
  items: EventStats[],
  field: EventStatsSortField,
  direction: SortDirection
): EventStats[] {
  const mult = direction === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    let cmp = 0;

    switch (field) {
      case "date":
        cmp = a.date.localeCompare(b.date);
        break;
      case "name":
        cmp = eventNameKey(a).localeCompare(eventNameKey(b), "ru");
        break;
      case "totalBets":
        cmp = a.totalBets - b.totalBets;
        break;
      case "winRate":
        cmp = compareWinRate(a, b);
        break;
      case "profit":
        cmp = a.profit - b.profit;
        break;
      case "pendingExposure":
        cmp = a.pendingExposure - b.pendingExposure;
        break;
    }

    if (cmp !== 0) return cmp * mult;
    return b.date.localeCompare(a.date);
  });
}
