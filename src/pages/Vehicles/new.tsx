import React, { useState } from 'react'
import { postVehicle } from '../../services/vehiclesApi'
import BasicForm from '../../components/Forms/BasicForm'
import { useNavigate, useParams } from 'react-router-dom'
import { validate } from '../../lib/validate'
import { registrationSchema } from '../../lib/schemas'
import { reportError } from '@/lib/reportError'

const VehiclesNew = () => {
  const navigate = useNavigate()
  let { id } = useParams()
  let [data, setData] = useState({ user_id: id, registration_number: '' })

  const save = async () => {
    let valid = validate(registrationSchema, data.registration_number)
    if (valid) {
      try {
        await postVehicle(data)
      } catch (error) {
        reportError(error, 'add the vehicle')
        return
      }
      navigate('/')
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setData(tempRecord)
  }

  return (
    <div className="w-full">
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
