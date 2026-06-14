export interface Team {
  /** Стабильный ключ (= teamKey), совпадает с getTeamMatchKey(canonicalName) */
  id: string;
  teamKey: string;
  /** Каноническое отображаемое имя */
  name: string;
  logoSlug: string;
}

export type TeamSides = {
  team1Id?: string | null;
  team2Id?: string | null;
  organization1: string;
  organization2: string;
};
