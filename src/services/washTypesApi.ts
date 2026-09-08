import { api } from './api'
import type { WashType, WashTypeInput } from '../types'

export const getWashes = () => api.get('wash_types').json<WashType[]>()

export const getWash = (id: string) =>
  api.get(`wash_types/${id}`).json<WashType>()

export const postWash = (body: WashTypeInput) =>
  api.post('wash_types', { json: body }).json<WashType>()

export const saveWash = (id: string, body: WashTypeInput) =>
  api.put(`wash_types/${id}`, { json: body }).json<WashType>()

export const updateWashOrder = (body: WashType[]) =>
  api.post('wash_types/bulk_update', { json: { wash_types: body } })

export const deleteWash = (id: string) => api.delete(`wash_types/${id}`)
