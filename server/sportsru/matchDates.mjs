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

const MATCHES_PAST_DAYS = 3;

/** Завтра, сегодня и последние 3 дня по календарю Sports.ru (МСК), либо явные даты. */
export function getSportsRuMatchPageUrls(dates) {
  const normalized = (Array.isArray(dates) ? dates : [])
    .map(normalizeSportsRuDateInput)
    .filter(Boolean);

  if (normalized.length > 0) {
    return [...new Set(normalized)].map(getSportsRuMatchPageUrl);
  }

  const offsets = [];
  for (let offset = -MATCHES_PAST_DAYS; offset <= 1; offset += 1) {
    offsets.push(offset);
  }

  return offsets.map((offset) => getSportsRuMatchPageUrl(moscowIsoDate(offset)));
}
