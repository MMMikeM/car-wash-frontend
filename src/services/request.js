const headers = new Headers({})

const request = async (method, path, body) => {
  headers.set('Content-Type', 'application/json')
  headers.set('X-User-Email', sessionStorage.getItem('email'))
  headers.set('X-User-Token', sessionStorage.getItem('token'))

  const baseUrl = process.env.REACT_APP_API_URL
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
      `Error fetching ${url}: ${response.status} (${response.statusCode}) ${response.body}`
    )
  }

  return response
}

export default request
