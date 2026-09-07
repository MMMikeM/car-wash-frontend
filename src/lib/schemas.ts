import { z } from 'zod'

export const nameSchema = z
  .string({ error: 'Please enter a valid name' })
  .min(1, 'Please enter a valid name')

/** Accepts '' because the forms submit that for an untouched field. */
export const emailSchema = z.union([
  z.literal(''),
  z.email('Please enter a valid email address'),
])

export const contactNumberSchema = z
  .string()
  .regex(
    /^0\d{9}$/,
    'Numbers must begin with 0 and be 10 digits long and contain no spaces'
  )

export const passwordSchema = z
  .string({ error: 'Please enter a valid password' })
  .min(6, 'Passwords must be at least 6 characters long')

export const customerSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  contact_number: contactNumberSchema.optional(),
})

/**
 * Extend this rather than rebuilding the refinement: zod 4 keeps refinements
 * through `.extend()`, which zod 3 could not do at all.
 */
export const passwordPairSchema = z
  .object({
    password: passwordSchema,
    password_confirmation: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Please ensure that passwords match',
    path: ['password_confirmation'],
  })
