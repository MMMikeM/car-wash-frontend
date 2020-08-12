import React, { useState } from 'react'
import { postVehicle } from '../../services/vehiclesApi'
import BasicForm from '../../components/Forms/BasicForm'
import { useHistory, useParams } from 'react-router-dom'

const VehiclesNew = () => {
  const history = useHistory()
  let { id } = useParams()
  let [data, setData] = useState({ user_id: id, registration_number: '' })

  const save = async () => {
    // eslint-disable-next-line no-unused-vars
    let res = await postVehicle(data)
    history.push('/')
  }

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
