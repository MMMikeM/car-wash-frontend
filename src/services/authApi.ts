import { api } from './api'
import type { LoginResponse } from '../types'

export const login = (contact_number: string, password: string) =>
  api.post('sign_in', { json: { contact_number, password } }).json<LoginResponse>()

export const updatePassword = (
  id: string,
  password: string,
  password_confirmation: string
) =>
  api.put(`customers/${id}/update_password`, {
    json: { password, password_confirmation },
  })

export const forgotPassword = (contact_number: string) =>
  api.post('customers/reset_password', { json: { contact_number } })
