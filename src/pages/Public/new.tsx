import React, { useState } from 'react'
import { postCustomer } from '../../services/customersApi'
import { SignUpForm } from './form'
import { useHistory } from 'react-router-dom'
import { validate } from '../../lib/validate'
import { customerSchema, passwordPairSchema } from '../../lib/schemas'

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
    let valid = validate(schema, localCustomer)
    if (valid) {
      setLoading(true)
      let res = await postCustomer(localCustomer)
      setLoading(false)
      history.push(`/login`)
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }
  const schema = passwordPairSchema.extend(customerSchema.shape)

  return (
    <div className="w-100">
      <div className="max-xs mx-auto d-flex flex-column mb-5">
        <h4 className="text-8 mb-5">
          Sign up for the Carbon Car Wash Loyalty programme
        </h4>
        {!loading ? (
          <SignUpForm
            editRecordMethod={editRecordMethod}
            localCustomer={localCustomer}
            save={save}
          />
        ) : (
            ''
          )}
      </div>
    </div>
  )
}

export default Signup
