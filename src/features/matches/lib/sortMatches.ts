import type { Match } from "@/entities/match";

export function sortMatchesByDateTime(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    const da = `${a.date}T${a.time}`;
    const db = `${b.date}T${b.time}`;
    return db.localeCompare(da);
  });
}
