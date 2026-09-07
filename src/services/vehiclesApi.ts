import request from './request'

export const postVehicle = async (body) => {
  let response = await request('POST', '/vehicles', body)
  return response.json()
}
