import React, { useState } from 'react'
import { postCustomer } from '../../services/customersApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import { useHistory } from 'react-router-dom'

const CustomersNew = () => {
  let [localCustomer, setLocalCustomer] = useState({
    name: '',
    email: '',
    contact_number: '',
  })
  let [loading, setLoading] = useState(false)

  const history = useHistory()

  const save = async () => {
    setLoading(true)
    // eslint-disable-next-line no-unused-vars
    let res = await postCustomer(localCustomer)
    setLoading(false)
    history.push('/')
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <BasicForm
          editRecordMethod={editRecordMethod}
          record={localCustomer}
          saveFormData={save}
          editableKeys={['name', 'email', 'contact_number']}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersNew
