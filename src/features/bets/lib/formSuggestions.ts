import type { Bet } from "@/entities/bet";

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "ru")
  );
}

export function getBetFormSuggestions(bets: Bet[]) {
  return {
    eventOrganizations: uniqueSorted(bets.map((b) => b.eventOrganization)),
    eventNames: uniqueSorted(bets.map((b) => b.eventName)),
    teams: uniqueSorted(bets.flatMap((b) => [b.organization1, b.organization2])),
  };
}

export function getEventTeamSuggestions(
  bets: Bet[],
  eventOrganization = "",
  eventName = ""
): string[] {
  const org = eventOrganization.trim();
  const name = eventName.trim();
  const forEvent = bets.filter((bet) => {
    if (org && bet.eventOrganization.trim() !== org) return false;
    if (name && bet.eventName.trim() !== name) return false;
    return true;
  });
  const eventTeams = forEvent.flatMap((bet) => [bet.organization1, bet.organization2]);
  return uniqueSorted([...eventTeams, ...getBetFormSuggestions(bets).teams]);
}

export function getEventNameSuggestions(bets: Bet[], eventOrganization: string): string[] {
  const org = eventOrganization.trim();
  if (!org) return uniqueSorted(bets.map((b) => b.eventName));

  const forOrg = uniqueSorted(
    bets.filter((b) => b.eventOrganization.trim() === org).map((b) => b.eventName)
  );
  return forOrg.length > 0 ? forOrg : uniqueSorted(bets.map((b) => b.eventName));
}

/** Организация турнира для каждого названия турнира (для логотипа в подсказках) */
export function getEventNameOrganizationMap(bets: Bet[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const bet of bets) {
    const name = bet.eventName.trim();
    const org = bet.eventOrganization.trim();
    if (name && org && !map.has(name)) {
      map.set(name, org);
    }
  }
  return map;
}
