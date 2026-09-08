import { isKyError } from 'ky'
import { toast } from '@/components/ui/toast'

export const reportError = (error: unknown, action: string) => {
  console.error(`Failed to ${action}:`, error)
  toast.error(
    `Could not ${action}`,
    isKyError(error) ? error.message : 'Something went wrong. Please try again.'
  )
}
