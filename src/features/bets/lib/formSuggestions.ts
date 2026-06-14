import type { Bet } from "@/entities/bet";
import { mergeEventTitle } from "@/features/events/lib/eventTitle";

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "ru")
  );
}

export function getBetFormSuggestions(bets: Bet[]) {
  return {
    eventOrganizations: uniqueSorted(bets.map((b) => b.eventName)),
    eventNames: uniqueSorted(bets.map((b) => b.eventName)),
    teams: uniqueSorted(bets.flatMap((b) => [b.organization1, b.organization2])),
  };
}

export function getEventTeamSuggestions(
  bets: Bet[],
  _eventOrganization = "",
  eventName = ""
): string[] {
  const name = eventName.trim();
  const forEvent = bets.filter((bet) => {
    if (name && bet.eventName.trim() !== name) return false;
    return true;
  });
  const eventTeams = forEvent.flatMap((bet) => [bet.organization1, bet.organization2]);
  return uniqueSorted([...eventTeams, ...getBetFormSuggestions(bets).teams]);
}

export function getEventNameSuggestions(bets: Bet[], _eventOrganization = ""): string[] {
  const titles = bets.map((bet) => mergeEventTitle("", bet.eventName));
  return uniqueSorted(titles);
}

/** Организация турнира для каждого названия турнира (для логотипа в подсказках) */
export function getEventNameOrganizationMap(bets: Bet[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const bet of bets) {
    const name = bet.eventName.trim();
    if (name && !map.has(name)) {
      map.set(name, name);
    }
  }
  return map;
}
