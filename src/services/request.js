const request = async (method, path, body) => {
  const baseUrl = "http://localhost:3001"

  const headers = {}
  const fetchOptions = { method, headers, body }

  const url = `${baseUrl}${path}`
  const response = await fetch(url, fetchOptions)

  const validStatuses = [200, 201, 302]
  const invalidStatuses = [401, 404, 500]

  if (validStatuses.includes(response.status)) {
    return response
  } else if (invalidStatuses.includes(response.status)) {
    console.error(`Error fetching ${url}: ${response.status} (${response.statusCode}) ${response.body}`)
  }

  return response
}

export default request
