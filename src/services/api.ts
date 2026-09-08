import ky, { isHTTPError, isNetworkError, isTimeoutError } from 'ky'

const useMocks =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true'

const basePath = new URL(import.meta.env.REACT_APP_API_URL).pathname.replace(
  /\/$/,
  ''
)

const relativePath = (url: string) =>
  new URL(url).pathname.slice(basePath.length)


const fromBody = (data: unknown): string | undefined => {
  if (typeof data === 'string') return data.trim() || undefined
  if (!data || typeof data !== 'object') return undefined

  for (const value of Object.values(data as Record<string, unknown>)) {
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      return value.join('\n') || undefined
    }
  }
  return undefined
}

const fromStatus = (status: number) => {
  if (status === 403) return 'You do not have permission to do that.'
  if (status === 404) return 'That record no longer exists.'
  if (status === 422) return 'The server rejected the change as invalid.'
  if (status >= 500) return 'The server had a problem. Please try again.'
  return `The server responded with ${status}.`
}

export const api = ky.create({
  prefix: import.meta.env.REACT_APP_API_URL,
  timeout: 15_000,
  // A retried POST would capture a wash twice.
  retry: { limit: 2, methods: ['get'] },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set(
          'X-User-Email',
          sessionStorage.getItem('email') ?? ''
        )
        request.headers.set(
          'X-User-Token',
          sessionStorage.getItem('token') ?? ''
        )
      },
      async ({ request }) => {
        if (!useMocks) return
        const { mockRequest } = await import('./mocks')
        return mockRequest(request.method, relativePath(request.url))
      },
    ],
    beforeError: [
      ({ error }) => {
        if (isTimeoutError(error)) {
          error.message = 'The server took too long to respond. Please try again.'
        } else if (isNetworkError(error)) {
          error.message =
            'Could not reach the server. Check your connection and try again.'
        } else if (isHTTPError(error)) {
          const message = fromBody(error.data)
          error.message =
            message && message.length <= 200
              ? message
              : fromStatus(error.response.status)
        }
        return error
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        if (response.status !== 401) return
        // Sign-in answers 401 for bad credentials, which Login reports itself.
        if (new URL(request.url).pathname.endsWith('/sign_in')) return
        if (!sessionStorage.getItem('token')) return

        sessionStorage.clear()
        window.location.assign('/login')
      },
    ],
  },
})

export const paginated = async <T>(
  path: string,
  searchParams: Record<string, string | number>
) => {
  const response = await api.get(path, { searchParams })
  return {
    data: (await response.json()) as T,
    total: Number.parseInt(response.headers.get('X-Instance-Total') || '0', 10),
  }
}
