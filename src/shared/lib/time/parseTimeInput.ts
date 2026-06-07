const PARTIAL_TIME = /^(\d{0,2})(:\d{0,2})?$/;

export function isPartialTimeInput(value: string): boolean {
  return value === "" || PARTIAL_TIME.test(value);
}

/** Нормализует введённое значение в HH:mm (24ч) */
export function normalizeTimeInput(raw: string, fallback = "00:00"): string {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return fallback;

  if (digits.length <= 2) {
    const hours = Math.min(23, Number.parseInt(digits, 10) || 0);
    return `${String(hours).padStart(2, "0")}:00`;
  }

  const hours = Math.min(23, Number.parseInt(digits.slice(0, 2), 10) || 0);
  const minutes = Math.min(59, Number.parseInt(digits.slice(2, 4).padEnd(2, "0"), 10) || 0);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Автовставка двоеточия при наборе цифр */
export function formatTimeWhileTyping(raw: string): string {
  const cleaned = raw.replace(/[^\d:]/g, "");
  if (cleaned.includes(":")) {
    const [h = "", m = ""] = cleaned.split(":");
    return `${h.slice(0, 2)}:${m.slice(0, 2)}`;
  }
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
}
