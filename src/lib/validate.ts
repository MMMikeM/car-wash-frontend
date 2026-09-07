import type { ZodType } from 'zod'

/** Reports whether the value passed. Failure messages are not surfaced yet. */
export const validate = (schema: ZodType, value: unknown): boolean => {
  const result = schema.safeParse(value)
  if (result.success) {
    return true
  }
  // TODO: replace with a toast - the failures are silent until then.
  // alert(result.error.issues.map((issue) => issue.message).join('\n'))
  return false
}
