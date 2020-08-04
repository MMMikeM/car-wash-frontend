import request from './request'

export const postWash = async (body) => {
  let response = await request('POST', '/washes', body)
  return response.json()
}

export const deleteWash = async (id) => {
  let response = await request('DELETE', `/washes/${id}`)
  //add error handling here
  return response.json()
}
