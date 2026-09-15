import { watch } from 'vue'

const PREFIX = 'skintet:'

/** Prototype reset: wipe saved cart/checkout and reload, so in-memory state starts clean too */
export function resetSession() {
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith(PREFIX)) sessionStorage.removeItem(key)
    }
  } catch {
    // Storage blocked — the reload still clears memory
  }
  window.location.replace(import.meta.env.BASE_URL)
}

/**
 * Keeps prototype state in sessionStorage, so a reload — or Safari evicting the page and
 * reloading it on Back — returns to the screen exactly as it was filled in.
 */
export function persist<T>(key: string, read: () => T, restore: (saved: T) => void) {
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    if (raw) restore(JSON.parse(raw))
  } catch {
    // Storage blocked or stale data — start fresh
  }
  watch(
    read,
    (value) => {
      try {
        sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
      } catch {
        // Private mode / quota — state still lives in memory
      }
    },
    { deep: true },
  )
}
