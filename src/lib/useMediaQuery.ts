import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = () => setMatches(list.matches)

    setMatches(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// Tailwind's md breakpoint. Kept in JS so a component can render one layout
// rather than both, which duplicates ids and text in the DOM.
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)')
