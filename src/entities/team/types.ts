export interface Team {
  id: string;
  name: string;
  synonyms: string[];
  logoSlug: string;
  vrsPoints: number;
}

export interface TeamEditInput {
  name: string;
  synonyms: string[];
}
