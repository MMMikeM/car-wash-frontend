import { api } from './api'
import type { Vehicle } from '../types'

export const postVehicle = (body: {
  user_id: string
  registration_number: string
}) => api.post('vehicles', { json: body }).json<Vehicle>()
