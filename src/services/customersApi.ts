import request from './request'

export const getCustomers = async (page = 0, perPage = 20) => {
  let response = await request('GET', `/customers?page=${page}&per_page=${perPage}`)
  const total = parseInt(response.headers.get('X-Instance-Total') || '0', 10)
  const data = await response.json()
  return { data, total }
}

export const getCustomersCSV = async () => {
  let response = await request('GET', '/customers.csv')
  return response.blob()
}

export const getCustomer = async (id) => {
  let response = await request('GET', `/customers/${id}`)
  return response.json()
}

export const postCustomer = async (body) => {
  let response = await request('POST', '/customers', body)
  return response.json()
}

export const saveCustomer = async (id, body) => {
  let response = await request('PUT', `/customers/${id}`, body)
  return response.json()
}
export const searchCustomer = async (searchTerm, searchValue, page = 0, perPage = 20) => {
  let response = await request('GET', `/customers?${searchTerm}=${searchValue}&page=${page}&per_page=${perPage}`)
  const total = parseInt(response.headers.get('X-Instance-Total') || '0', 10)
  const data = await response.json()
  return { data, total }
}

export const deleteCustomer = async (id) => {
  let response = await request('DELETE', `/customers/${id}`)
  return response.json()
}

export const getSystemUsers = async () => {
  let response = await request('GET', `/system_users`)
  return response.json()
}

export const saveSystemUsers = async (id, body) => {
  let response = await request('PUT', `/system_users/${id}/roles`, body)
  return response.json()
}
