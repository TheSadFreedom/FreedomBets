const MOSCOW_TZ = "Europe/Moscow";

export function moscowIsoDate(offsetDays = 0): string {
  const instant = Date.now() + offsetDays * 86_400_000;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MOSCOW_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

export function moscowDateRange(fromOffset: number, toOffset: number): string[] {
  const start = Math.min(fromOffset, toOffset);
  const end = Math.max(fromOffset, toOffset);
  const dates: string[] = [];

  for (let offset = start; offset <= end; offset += 1) {
    dates.push(moscowIsoDate(offset));
  }

  return dates;
}

export const sportsRuSyncPresets = {
  tomorrow: () => [moscowIsoDate(1)],
  today: () => [moscowIsoDate(0)],
  yesterday: () => [moscowIsoDate(-1)],
  nearbyDays: () => moscowDateRange(-1, 1),
  last30Days: () => moscowDateRange(-29, 0),
  settingsImport: () => moscowDateRange(-29, 1),
} as const;
