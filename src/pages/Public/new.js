import React, { useState } from 'react'
import { postCustomer } from '../../services/customersApi.js'
import { SignUpForm } from './form'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'

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
    let valid = await schema.validate(localCustomer).catch((err) => {
      alert(err.errors)
    })
    if (valid) {
      setLoading(true)
      // eslint-disable-next-line no-unused-vars
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
  const schema = yup.object().shape({
    name: yup.string().required('Please enter a valid name'),
    email: yup.string().email('Please enter a valid email address'),
    contact_number: yup
      .string()
      .matches(/^0\d{9}$/g, 'Numbers must begin with 0 and be 10 digits long and contain no spaces')
      .strict(),
    password: yup
      .string()
      .required('Please enter a valid password')
      .min(6, 'Passwords must be at least 6 characters long'),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Please ensure that passwords match'),
  })

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
