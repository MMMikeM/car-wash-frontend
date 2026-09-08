import { api } from './api'
import type { Wash } from '../types'

export const postWash = (body: {
  user_id: string
  wash_type_id: string
  insurance: boolean
}) => api.post('washes', { json: body }).json<Wash>()

export const deleteWash = (id: string) => api.delete(`washes/${id}`)
