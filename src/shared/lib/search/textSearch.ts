export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function tokenizeSearchQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

function searchWords(parts: Array<string | null | undefined>): string[] {
  const normalized = normalizeSearchText(parts.filter(Boolean).join(" "));
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

function wordMatchesToken(word: string, token: string): boolean {
  if (word === token) return true;
  if (token.length >= 2 && word.startsWith(token)) return true;
  if (word.length >= 3 && token.length >= 3 && token.startsWith(word)) return true;
  return false;
}

function tokenMatchesSearchWords(words: string[], token: string): boolean {
  return words.some((word) => wordMatchesToken(word, token));
}

/** Every query word must match a whole word in the combined haystack (prefix ok). */
export function matchesSearchQuery(
  parts: Array<string | null | undefined>,
  query: string
): boolean {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return true;

  const words = searchWords(parts);
  if (words.length === 0) return false;

  return tokens.every((token) => tokenMatchesSearchWords(words, token));
}
