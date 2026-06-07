import { parseIsoDate } from "@/shared/lib/date/isoDate";

const PARTIAL_DOTS_DATE = /^(\d{0,2})(\.\d{0,2}(\.\d{0,4})?)?$/;

const pad2 = (n: number) => String(n).padStart(2, "0");

export function isPartialDateInput(value: string): boolean {
  return value === "" || PARTIAL_DOTS_DATE.test(value);
}

/** Автовставка точек при наборе цифр: 04062026 → 04.06.2026 */
export function formatDateWhileTyping(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

/** ДД.ММ.ГГГГ → YYYY-MM-DD */
export function normalizeDateInput(raw: string, fallbackIso: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return fallbackIso;

  if (parseIsoDate(trimmed)) return trimmed;

  const dots = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(trimmed);
  if (dots) {
    const d = Number(dots[1]);
    const m = Number(dots[2]);
    const y = Number(dots[3]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1000) {
      return `${y}-${pad2(m)}-${pad2(d)}`;
    }
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 8) {
    const d = Number(digits.slice(0, 2));
    const m = Number(digits.slice(2, 4));
    const y = Number(digits.slice(4));
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1000) {
      return `${y}-${pad2(m)}-${pad2(d)}`;
    }
  }

  return fallbackIso;
}

export function isCompleteDateInput(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  if (parseIsoDate(trimmed)) return true;

  const probe = normalizeDateInput(trimmed, "INVALID_PROBE");
  return probe !== "INVALID_PROBE" && Boolean(parseIsoDate(probe));
}
