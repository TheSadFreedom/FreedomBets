const MOSCOW_TZ = "Europe/Moscow";
const MATCHES_BASE_URL = "https://cyber.sports.ru/cs/match";

export function moscowIsoDate(offsetDays = 0) {
  const instant = Date.now() + offsetDays * 86_400_000;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MOSCOW_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** ISO YYYY-MM-DD или DD.MM.YYYY → ISO YYYY-MM-DD. */
export function normalizeSportsRuDateInput(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const dotted = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotted) {
    return `${dotted[3]}-${dotted[2]}-${dotted[1]}`;
  }

  return null;
}

export function getSportsRuMatchPageUrl(isoDate) {
  return `${MATCHES_BASE_URL}/${isoDate}/`;
}

/** Вчера, сегодня и завтра по календарю Sports.ru (МСК), либо явные даты. */
export function getSportsRuMatchPageUrls(dates) {
  const normalized = (Array.isArray(dates) ? dates : [])
    .map(normalizeSportsRuDateInput)
    .filter(Boolean);

  if (normalized.length > 0) {
    return [...new Set(normalized)].map(getSportsRuMatchPageUrl);
  }

  return [-1, 0, 1].map((offset) => getSportsRuMatchPageUrl(moscowIsoDate(offset)));
}
