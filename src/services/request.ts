const headers = new Headers({})

// Compiled out of builds: import.meta.env.DEV is replaced with false, which
// drops the branch and the dynamically imported fixtures with it.
const useMocks =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true'

const request = async (method, path, body?) => {
  if (useMocks) {
    const { mockRequest } = await import('./mocks')
    const mocked = mockRequest(method, path)
    if (mocked) {
      return mocked
    }
  }

  headers.set('Content-Type', 'application/json')
  headers.set('X-User-Email', sessionStorage.getItem('email'))
  headers.set('X-User-Token', sessionStorage.getItem('token'))

  const baseUrl = import.meta.env.REACT_APP_API_URL
  const fetchOptions = { method, headers, body: JSON.stringify(body) }
  const url = `${baseUrl}${path}`
  const response = await fetch(url, fetchOptions)

  const validStatuses = [200, 201, 204, 302]
  const invalidStatuses = [401, 404, 422, 400, 500]

  if (validStatuses.includes(response.status)) {
    return response
  } else if (invalidStatuses.includes(response.status)) {
    // throw new Error(
    console.log(
      `Error fetching ${url}: ${response.status} (${response.statusText}) ${response.body}`
    )
  }

  return response
}

export default request
