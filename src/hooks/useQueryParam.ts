import { useLocation } from 'react-router-dom'

// Returns the value, not the `URLSearchParams`: a fresh object every render can
// never be a stable effect dependency.
export const useQueryParam = (name: string) =>
  new URLSearchParams(useLocation().search).get(name)
