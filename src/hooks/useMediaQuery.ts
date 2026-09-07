import { useCallback, useSyncExternalStore } from 'react'

/**
 * `matchMedia` returns a fresh MediaQueryList on every call, each carrying its
 * own listener set. Sharing one per query keeps every caller on a single
 * native subscription and makes `getSnapshot` a cheap property read.
 */
const lists = new Map<string, MediaQueryList>()

const listFor = (query: string) => {
  let list = lists.get(query)
  if (!list) {
    list = window.matchMedia(query)
    lists.set(query, list)
  }
  return list
}

/**
 * Tracks a CSS media query.
 *
 * Built on `useSyncExternalStore` rather than the more common `useState` +
 * `useEffect`: that form has to paint once with a guessed default and correct
 * itself afterwards, which for a layout switch is a visible flash of the wrong
 * component. `useSyncExternalStore` reads `matches` during render, so the
 * first paint is already correct, and it is the API React provides for
 * external stores under concurrent rendering.
 */
export const useMediaQuery = (query: string): boolean => {
  // useSyncExternalStore tears down and re-subscribes whenever this function's
  // identity changes, so it must stay stable for a given query.
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = listFor(query)
      list.addEventListener('change', onStoreChange)
      return () => list.removeEventListener('change', onStoreChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => listFor(query).matches,
    // Nothing renders on a server today; if that changes, mobile-first is the
    // safe assumption to hydrate from.
    () => false
  )
}
