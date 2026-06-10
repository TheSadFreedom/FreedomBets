const CACHE_TTL_MS = 5 * 60_000;

/** @type {Map<string, { expiresAt: number, value: unknown }>} */
const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key, value, ttlMs = CACHE_TTL_MS) {
  store.set(key, {
    expiresAt: Date.now() + ttlMs,
    value,
  });
}
