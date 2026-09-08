import * as v from 'valibot'
import { toast } from '@/components/ui/toast'

/** Toasts every failure message, and reports whether the value passed. */
export const validate = (
  schema: v.GenericSchema | v.GenericSchemaAsync | any,
  value: unknown
): boolean => {
  const result = v.safeParse(schema, value)
  if (result.success) {
    return true
  }
  toast.error(
    'Check the form',
    result.issues.map((issue) => issue.message).join('\n')
  )
  return false
}
