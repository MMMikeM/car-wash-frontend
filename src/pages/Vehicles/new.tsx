import React, { useState } from 'react'
import { postVehicle } from '../../services/vehiclesApi'
import BasicForm from '../../components/Forms/BasicForm'
import { useHistory, useParams } from 'react-router-dom'
import { z } from 'zod'
import { validate } from '../../lib/validate'

const VehiclesNew = () => {
  const history = useHistory()
  let { id } = useParams()
  let [data, setData] = useState({ user_id: id, registration_number: '' })

  const save = async () => {
    let valid = validate(schema, data.registration_number)
    if (valid) {
      let res = await postVehicle(data)
      history.push('/')
    }
  }

  const schema = z
    .string({ error: 'Please enter a valid registration' })
    .min(3, 'Please enter at least 3 characters')
    .max(12, 'Maximum of 12 digits')
    .regex(/^\w+$/, 'Registrations can only be letters and numbers')

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setData(tempRecord)
  }

  return (
    <div className="w-100">
      <div className="max-sm mx-auto">
        <BasicForm
          editRecordMethod={editRecordMethod}
          record={data}
          saveFormData={save}
          editableKeys={['registration_number']}
          valueTransformations={['']}
        />
      </div>
    </div>
  )
}

export default VehiclesNew
