import React, { useState } from 'react'
import BasicForm from '../../components/Forms/BasicForm'
import { useParams, useHistory } from 'react-router-dom'
import { updatePassword } from '../../services/authApi'
import * as yup from 'yup'

const PasswordReset = () => {
  const history = useHistory()
  const { id } = useParams()
  let [localUser, setLocalUser] = useState({
    password: '',
    password_confirmation: '',
  })

  const savePassword = async () => {
    let valid = await schema.validate(localUser).catch((err) => {
      alert(err.errors)
    })
    if (valid) {
      // eslint-disable-next-line no-unused-vars
      await updatePassword(
        id,
        localUser.password,
        localUser.password_confirmation
      )

      alert('Your password has been updated')
      history.push('/')
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalUser(tempRecord)
  }

  const schema = yup.object().shape({
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
      <div className="max-xs mx-auto">
        <h6 className="text-9">Please enter a new password</h6>
        <BasicForm
          editRecordMethod={editRecordMethod}
          record={localUser}
          saveFormData={savePassword}
          editableKeys={['password', 'password_confirmation']}
          valueTransformations={['', '']}
          inputTypes={['password', 'password']}
        />
      </div>
    </div>
  )
}

export default PasswordReset
