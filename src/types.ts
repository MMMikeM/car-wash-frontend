export interface Vehicle {
  id?: string
  registration_number: string
}

/** A wash a customer has had - not WashType, which is the price list entry. */
export interface Wash {
  id: string
  wash_type_id: string
  created_at: string
  /** Set client-side by looking wash_type_id up against the wash types. */
  wash?: string
}

export interface WashType {
  id: string
  name: string
  description: string
  cost: number
  price: number
  points: number
  order: number
  free?: boolean
}

/** Form fields arrive as strings; the API coerces the numeric ones. */
export interface WashTypeInput {
  name?: string
  description?: string
  cost?: string | number
  price?: string | number
  points?: string | number
  free?: boolean
  order?: number
}

export interface Customer {
  id: string
  name: string
  email: string
  contact_number: string
  total_points: number
  loyalty_enabled?: boolean
  roles?: string[]
  vehicles?: Vehicle[]
  washes?: Wash[]
}

export interface LoginResponse {
  is_success: boolean
  data: {
    user: {
      id: string
      email: string
      roles: string[]
      authentication_token: string
    }
  }
}
