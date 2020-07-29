import request from './request'

export const getWashes = async () => {
  let response = await request('GET', '/wash_types')
  return response.json()
}

export const getWash = async (id) => {
  let response = await request('GET', `/wash_types/${id}`)
  return response.json()
}

export const postWash = async (body) => {
  let response = await request('POST', '/wash_types', body)
  return response.json()
}

export const saveWash = async (id, body) => {
  let response = await request('PUT', `/wash_types/${id}`, body)
  return response.json()
}
