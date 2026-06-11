/** Sports.ru отдаёт расписание в МСК; в приложении показываем +2 ч к МСК. */
export const SPORTSRU_MSK_OFFSET_HOURS = 2;

const MSK_UTC_OFFSET_HOURS = 3;

function pad2(value) {
  return String(value).padStart(2, "0");
}

function parseMoscowWallTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }

  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");

  return {
    date: year && month && day ? `${year}-${month}-${day}` : "",
    time: hour && minute ? `${hour}:${minute}` : "",
  };
}

/** Сдвигает дату/время, заданные как стенное время МСК, на offsetHours. */
export function shiftMskWallTime(date, time, offsetHours = SPORTSRU_MSK_OFFSET_HOURS) {
  if (!date || !time) {
    return { date: date || "", time: time || "12:00" };
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    return { date, time };
  }

  const utcMs = Date.UTC(year, month - 1, day, hour - MSK_UTC_OFFSET_HOURS, minute);
  const localUtcMs = utcMs + (MSK_UTC_OFFSET_HOURS + offsetHours) * 3_600_000;
  const local = new Date(localUtcMs);

  return {
    date: `${local.getUTCFullYear()}-${pad2(local.getUTCMonth() + 1)}-${pad2(local.getUTCDate())}`,
    time: `${pad2(local.getUTCHours())}:${pad2(local.getUTCMinutes())}`,
  };
}

export function parseSportsRuSchedule(iso, { offsetHours = SPORTSRU_MSK_OFFSET_HOURS } = {}) {
  const moscow = parseMoscowWallTime(iso);
  if (!moscow.date || !moscow.time) {
    return shiftMskWallTime("1970-01-01", "12:00", offsetHours);
  }

  return shiftMskWallTime(moscow.date, moscow.time, offsetHours);
}

export function applySportsRuLocalTime(date, time, { offsetHours = SPORTSRU_MSK_OFFSET_HOURS } = {}) {
  const normalizedTime = String(time ?? "").trim() || "12:00";
  const normalizedDate = String(date ?? "").trim() || "1970-01-01";
  return shiftMskWallTime(normalizedDate, normalizedTime, offsetHours);
}
