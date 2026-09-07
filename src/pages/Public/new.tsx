import React, { useState } from 'react'
import { postCustomer } from '../../services/customersApi'
import { SignUpForm } from './form'
import { useHistory } from 'react-router-dom'
import { validate } from '../../lib/validate'
import { reportError } from '@/lib/reportError'
import { signUpSchema } from '../../lib/schemas'

const Signup = () => {
  let [localCustomer, setLocalCustomer] = useState({
    name: '',
    email: '',
    contact_number: '',
    password: '',
    password_confirmation: '',
    opted_for_marketing: true,
  })
  let [loading, setLoading] = useState(false)

  const history = useHistory()

  const save = async () => {
    let valid = validate(signUpSchema, localCustomer)
    if (valid) {
      setLoading(true)
      try {
        await postCustomer(localCustomer)
        history.push(`/login`)
      } catch (error) {
        reportError(error, 'create your account')
      } finally {
        setLoading(false)
      }
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  return (
    <div className="w-full">
      <div className="max-xs mx-auto flex flex-col mb-5">
        <h4 className="text-8 mb-5">
          Sign up for the Carbon Car Wash Loyalty programme
        </h4>
          <SignUpForm
          saving={loading}
            editRecordMethod={editRecordMethod}
            localCustomer={localCustomer}
            save={save}
          />
      </div>
    </div>
  )
}

export default Signup
