import request from './request'

export const login = async (contact_number, password) => {
  let response = await request('POST', '/sign_in', {
    contact_number: contact_number,
    password: password,
  })
  let parsedResponse = response.json()
  return parsedResponse
}

export const updatePassword = async (id, password, password_confirmation) => {
  let response = await request('PUT', `/customers/${id}/update_password`, {
    password: password,
    password_confirmation: password_confirmation,
  })
  return response
}

export const forgotPassword = async (contact_number) => {
  let response = await request('POST', `/customers/reset_password`, {
    contact_number: contact_number,
  })
  return response
}
