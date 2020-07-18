import request from './request'

export const getCustomers = async () => {
  let response = await request('GET', '/customers')
  return response.json()
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
