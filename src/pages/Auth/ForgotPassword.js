import React, { useState } from 'react'
import BasicForm from '../../components/Forms/BasicForm'
import { useHistory } from 'react-router-dom'
import { forgotPassword } from '../../services/authApi'
import * as yup from 'yup'

export const schema = yup.object().shape({
  contact_number: yup
    .string()
    .matches(/^0\d{9}$/g, 'Numbers must begin with 0 and be 10 digits long and contain no spaces')
    .strict()
})

const ForgotPassword = () => {
  const history = useHistory()
  let [localUser, setLocalUser] = useState({
    contact_number: '',
  })

  const resetPassword = async () => {
    let valid = await schema.validate(localUser).catch((err) => {
      alert(err.errors)
    })
    if (valid) {
      await forgotPassword(localUser.contact_number)
      alert('Your should receive an sms with a link to reset your password')
      history.push('/')
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalUser(tempRecord)
  }

  return (
    <div className="max-xs">
      <h6 className="text-8 mt-3 mb-4">
        Please enter your contact number, a link will be sent if you have an
        existing account with us
      </h6>
      <BasicForm
        editRecordMethod={editRecordMethod}
        record={localUser}
        saveFormData={resetPassword}
        editableKeys={['contact_number']}
        valueTransformations={['']}
      />
    </div>
  )
}

export default ForgotPassword
