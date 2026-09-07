import ky from 'ky'

// Compiled out of builds: import.meta.env.DEV is replaced with false, which
// drops the branch and the dynamically imported fixtures with it.
const useMocks =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true'

const isSignIn = (url: string) => new URL(url).pathname.endsWith('/sign_in')

const api = ky.create({
  prefix: import.meta.env.REACT_APP_API_URL,
  timeout: 15_000,
  // Only idempotent methods: a retried POST would capture a wash twice.
  retry: { limit: 2, methods: ['get'] },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set('X-User-Email', sessionStorage.getItem('email') ?? '')
        request.headers.set('X-User-Token', sessionStorage.getItem('token') ?? '')
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        // An expired token otherwise reaches the pages as an error body they
        // try to render, which unmounts the app. Sign-in is exempt: a 401 there
        // means bad credentials, and Login reports that itself.
        if (response.status !== 401) return
        if (isSignIn(request.url)) return
        if (!sessionStorage.getItem('token')) return

        sessionStorage.clear()
        window.location.assign('/login')
      },
    ],
  },
})

/**
 * Rejects with a ky `HTTPError` on any non-2xx, so a failed call can never be
 * mistaken for a successful one. Callers are expected to catch.
 */
const request = async (method: string, path: string, body?: unknown) => {
  if (useMocks) {
    const { mockRequest } = await import('./mocks')
    const mocked = mockRequest(method, path)
    if (mocked) {
      return mocked
    }
  }

  return api(path, { method, ...(body === undefined ? {} : { json: body }) })
}

export default request
