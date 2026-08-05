'use client'

/**
 * Local JSON persistence with corruption tolerance.
 *
 * The app caches its "saved data" in localStorage as JSON blobs so data
 * survives reloads and works even when the server/API is unavailable. Every
 * read is guarded so a corrupted blob can never crash the UI:
 *
 *   - If a blob fails to parse (an old/corrupted "file"), we DELETE it and
 *     return null — "remove the old, keep the new" — and the app simply
 *     starts fresh with no previous data instead of breaking.
 *   - Every write overwrites the previous blob with the newest snapshot, so we
 *     only ever keep the most recent, valid copy.
 *
 * All functions are SSR-safe (no-ops when `window` is undefined).
 */

const STORAGE_PREFIX = 'forge:'

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/** Read + JSON-parse a key. Missing or corrupt data returns null. If the raw
 *  value existed but was invalid, the stale entry is removed. */
export function readLocal<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    const data = safeParse<T>(raw)
    if (data === null && raw !== null) {
      // Old/corrupted blob — drop it and continue fresh.
      window.localStorage.removeItem(STORAGE_PREFIX + key)
    }
    return data
  } catch {
    return null
  }
}

/** Serialize + write a value, replacing any previous blob for this key.
 *  Returns true on success, false on storage failure (quota, privacy mode). */
export function writeLocal<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/** Remove a key entirely. */
export function clearLocal(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    /* ignore */
  }
}
