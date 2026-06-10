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

/** Вчера, сегодня и завтра по календарю Sports.ru (МСК). */
export function getSportsRuMatchPageUrls() {
  return [-1, 0, 1].map((offset) => `${MATCHES_BASE_URL}/${moscowIsoDate(offset)}/`);
}
