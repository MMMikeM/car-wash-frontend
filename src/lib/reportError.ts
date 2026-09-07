import { HTTPError, TimeoutError } from 'ky'
import { toast } from '@/components/ui/toast'

const describe = (error: unknown): string => {
  if (error instanceof TimeoutError) {
    return 'The server took too long to respond. Please try again.'
  }

  if (error instanceof HTTPError) {
    const { status } = error.response
    if (status === 403) return 'You do not have permission to do that.'
    if (status === 404) return 'That record no longer exists.'
    if (status === 422) return 'The server rejected the change as invalid.'
    if (status >= 500) return 'The server had a problem. Please try again.'
    return `The server responded with ${status}.`
  }

  return 'Could not reach the server. Check your connection and try again.'
}

/**
 * Turns a rejected request into a toast. Every call that can fail routes
 * through here so a failure is never mistaken for success - which is what
 * happened while the request layer returned error responses as if they were
 * valid.
 */
export const reportError = (error: unknown, action: string) => {
  console.error(`Failed to ${action}:`, error)
  toast.error(`Could not ${action}`, describe(error))
}
