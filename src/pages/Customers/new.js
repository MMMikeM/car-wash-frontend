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
    let res = await postCustomer(localCustomer)
    setLoading(false)
    history.push('/')
  }

  const editRecordMethod = (record, key, value) => {
    console.log('on change')
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  return (
    <div>
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
