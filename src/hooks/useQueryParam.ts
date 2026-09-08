import { useLocation } from 'react-router-dom'

/**
 * Reads one query-string value.
 *
 * Returns the value rather than the `URLSearchParams`: a fresh object every
 * render can never be a stable effect dependency, but a string can.
 */
export const useQueryParam = (name: string) =>
  new URLSearchParams(useLocation().search).get(name)
