import type { ZodType } from 'zod'
import { toast } from '@/components/ui/toast'

/** Toasts every failure message, and reports whether the value passed. */
export const validate = (schema: ZodType, value: unknown): boolean => {
  const result = schema.safeParse(value)
  if (result.success) {
    return true
  }
  toast.error(
    'Check the form',
    result.error.issues.map((issue) => issue.message).join('\n')
  )
  return false
}
