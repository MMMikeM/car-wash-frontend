import * as v from 'valibot'

export const nameSchema = v.pipe(
  v.string('Please enter a valid name'),
  v.minLength(1, 'Please enter a valid name')
)

/** Accepts '' because the forms submit that for an untouched field. */
export const emailSchema = v.union([
  v.literal(''),
  v.pipe(v.string(), v.email('Please enter a valid email address')),
])

export const contactNumberSchema = v.pipe(
  v.string(),
  v.regex(
    /^0\d{9}$/,
    'Numbers must begin with 0 and be 10 digits long and contain no spaces'
  )
)

export const passwordSchema = v.pipe(
  v.string('Please enter a valid password'),
  v.minLength(6, 'Passwords must be at least 6 characters long')
)

// Entries, not just a schema: valibot puts cross-field checks in the pipe around
// an object, so composing two means rebuilding from entries. See `signUpSchema`.
export const customerEntries = {
  name: nameSchema,
  email: v.optional(emailSchema),
  contact_number: v.optional(contactNumberSchema),
}

export const customerSchema = v.object(customerEntries)

export const passwordPairEntries = {
  password: passwordSchema,
  password_confirmation: v.optional(v.string()),
}

// A `check` action fixes its input type, so the predicate is shared but the
// action cannot be.
const passwordsMatch = (input) =>
  input.password === input.password_confirmation

const PASSWORDS_MATCH_MESSAGE = 'Please ensure that passwords match'

export const passwordPairSchema = v.pipe(
  v.object(passwordPairEntries),
  v.check(passwordsMatch, PASSWORDS_MATCH_MESSAGE)
)

export const signUpSchema = v.pipe(
  v.object({ ...passwordPairEntries, ...customerEntries }),
  v.check(passwordsMatch, PASSWORDS_MATCH_MESSAGE)
)

export const registrationSchema = v.pipe(
  v.string('Please enter a valid registration'),
  v.minLength(3, 'Please enter at least 3 characters'),
  v.maxLength(12, 'Maximum of 12 digits'),
  v.regex(/^\w+$/, 'Registrations can only be letters and numbers')
)
