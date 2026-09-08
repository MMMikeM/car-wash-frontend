import { useCallback, useSyncExternalStore } from 'react'

// `matchMedia` returns a fresh MediaQueryList per call, each with its own
// listener set; caching keeps every caller on one native subscription.
const lists = new Map<string, MediaQueryList>()

const listFor = (query: string) => {
  let list = lists.get(query)
  if (!list) {
    list = window.matchMedia(query)
    lists.set(query, list)
  }
  return list
}

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
    // Nothing server-renders today; mobile-first is the safe default if it does.
    () => false
  )
}
