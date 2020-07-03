import request from './request'

export const getCustomers = async () => {
  let response = await request("GET", "/customers")
  return response.json()
}
