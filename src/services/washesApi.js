import request from './request'

export const postWash = async (type, user) => {
  let response = await request('POST', '/washes', body)
  return response.json()
}

export const deleteWash = async (id) => {
  let response = await request('DELETE', `/washes/${id}`, body)
  return response.json()
}
