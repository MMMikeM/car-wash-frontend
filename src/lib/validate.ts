import type { ZodType } from 'zod'

/** Alerts every failure message, and reports whether the value passed. */
export const validate = (schema: ZodType, value: unknown): boolean => {
  const result = schema.safeParse(value)
  if (result.success) {
    return true
  }
  alert(result.error.issues.map((issue) => issue.message).join('\n'))
  return false
}
