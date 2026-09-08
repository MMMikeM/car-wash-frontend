// Vite replaces import.meta.env.DEV with false when building, so the bypass
// and the variable it reads are dropped from production bundles entirely.
const devRoles = import.meta.env.DEV ? import.meta.env.VITE_DEV_AUTH_ROLE : ''

export type Role = 'manager' | 'salesperson' | 'customer'

export const currentRoles = (): string[] => {
  if (devRoles) {
    return devRoles.split(',').map((role) => role.trim())
  }

  const token = sessionStorage.getItem('token')
  if (!token) {
    return []
  }

  return JSON.parse(sessionStorage.getItem('roles')) ?? []
}

export const hasRole = (...allowed: Role[]): boolean =>
  currentRoles().some((role) => allowed.includes(role as Role))
