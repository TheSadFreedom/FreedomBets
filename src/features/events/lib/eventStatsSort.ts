import type { EventStats } from "@/entities/event";

export type EventStatsSortField =
  | "date"
  | "endDate"
  | "name"
  | "totalBets"
  | "winRate"
  | "profit"
  | "pendingExposure";

export type SortDirection = "asc" | "desc";

export type EventStatsSortOption = `${EventStatsSortField}:${SortDirection}`;

export const EVENT_STATS_SORT_OPTIONS: ReadonlyArray<{
  value: EventStatsSortOption;
  label: string;
}> = [
  { value: "date:desc", label: "Дата начала: сначала новые" },
  { value: "date:asc", label: "Дата начала: сначала старые" },
  { value: "endDate:desc", label: "Дата окончания: сначала новые" },
  { value: "endDate:asc", label: "Дата окончания: сначала старые" },
  { value: "name:asc", label: "Название: А → Я" },
  { value: "name:desc", label: "Название: Я → А" },
  { value: "totalBets:desc", label: "Ставок: больше" },
  { value: "totalBets:asc", label: "Ставок: меньше" },
  { value: "profit:desc", label: "Профит: выше" },
  { value: "profit:asc", label: "Профит: ниже" },
  { value: "winRate:desc", label: "Винрейт: выше" },
  { value: "pendingExposure:desc", label: "В игре: больше" },
];

export function parseEventStatsSortOption(option: EventStatsSortOption): {
  field: EventStatsSortField;
  direction: SortDirection;
} {
  const [field, direction] = option.split(":") as [EventStatsSortField, SortDirection];
  return { field, direction };
}

export function toEventStatsSortOption(
  field: EventStatsSortField,
  direction: SortDirection
): EventStatsSortOption {
  return `${field}:${direction}`;
}

function eventNameKey(item: EventStats): string {
  return `${item.eventOrganization} ${item.eventName}`.trim();
}

/** Сравнение даты начала; пустые даты — в конце списка. */
export function compareStartDate(
  a: string,
  b: string,
  direction: SortDirection = "desc"
): number {
  const aDate = a.trim();
  const bDate = b.trim();
  if (!aDate && !bDate) return 0;
  if (!aDate) return 1;
  if (!bDate) return -1;

  const cmp = aDate.localeCompare(bDate);
  return direction === "asc" ? cmp : -cmp;
}

export function sortEventStatsByStartDateDesc(items: EventStats[]): EventStats[] {
  return sortEventStatsList(items, "date", "desc");
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
        cmp = compareStartDate(a.date, b.date, "asc");
        break;
      case "endDate": {
        const aEnd = a.endDate?.trim() || a.date;
        const bEnd = b.endDate?.trim() || b.date;
        cmp = aEnd.localeCompare(bEnd);
        break;
      }
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
    return compareStartDate(a.date, b.date, "desc");
  });
}
