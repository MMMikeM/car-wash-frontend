import { api, paginated } from './api'
import type { Customer } from '../types'

export const getCustomers = (page = 0, perPage = 20) =>
  paginated<Customer[]>('customers', { page, per_page: perPage })

export const searchCustomer = (
  field: string,
  value: string,
  page = 0,
  perPage = 20
) =>
  paginated<Customer[]>('customers', {
    [field]: value,
    page,
    per_page: perPage,
  })

export const getCustomersCSV = () => api.get('customers.csv').blob()

export const getCustomer = (id: string) =>
  api.get(`customers/${id}`).json<Customer>()

export const postCustomer = (body: Partial<Customer>) =>
  api.post('customers', { json: body }).json<Customer>()

export const saveCustomer = (id: string, body: Partial<Customer>) =>
  api.put(`customers/${id}`, { json: body }).json<Customer>()

export const deleteCustomer = (id: string) => api.delete(`customers/${id}`)

export const getSystemUsers = () => api.get('system_users').json<Customer[]>()

export const saveSystemUsers = (id: string, body: { roles: string[] }) =>
  api.put(`system_users/${id}/roles`, { json: body }).json<Customer>()
