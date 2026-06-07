export function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** ISO YYYY-MM-DD → ДД.ММ.ГГГГ без сдвига из-за часового пояса */
export function formatIsoDateDots(iso: string): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  return `${pad2(parts.d)}.${pad2(parts.m)}.${parts.y}`;
}

export function formatIsoDateTimeDots(iso: string, time: string): string {
  return `${formatIsoDateDots(iso)} · ${time}`;
}

export function formatIsoDateRange(startIso: string, endIso?: string): string {
  const start = startIso.trim();
  if (!start) return "";

  const startLabel = formatIsoDateDots(start);
  const end = endIso?.trim() ?? "";
  if (!end || end === start) return startLabel;

  const endLabel = formatIsoDateDots(end);
  if (!endLabel || endLabel === startLabel) return startLabel;

  return `${startLabel} — ${endLabel}`;
}

/** Сегодня в локальной календарной дате (не UTC) */
export function todayIsoDateLocal(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}
