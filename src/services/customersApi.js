import request from './request'

export const getCustomers = async () => {
  let response = await request('GET', '/customers')
  return response.json()
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
export const searchCustomer = async (searchTerm, searchValue) => {
  let response = await request('GET', `/customers?${searchTerm}=${searchValue}`)
  return response.json()
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
