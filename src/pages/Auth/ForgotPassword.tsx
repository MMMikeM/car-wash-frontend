import React, { useState } from 'react'
import BasicForm from '../../components/Forms/BasicForm'
import { useHistory } from 'react-router-dom'
import { forgotPassword } from '../../services/authApi'
import { z } from 'zod'
import { validate } from '../../lib/validate'
import { contactNumberSchema } from '../../lib/schemas'
import { toast } from '@/components/ui/toast'

export const schema = z.object({ contact_number: contactNumberSchema.optional() })

const ForgotPassword = () => {
  const history = useHistory()
  let [localUser, setLocalUser] = useState({
    contact_number: '',
  })

  const resetPassword = async () => {
    let valid = validate(schema, localUser)
    if (valid) {
      await forgotPassword(localUser.contact_number)
      toast.success(
        'Check your phone',
        'An SMS with a link to reset your password is on its way.'
      )
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
