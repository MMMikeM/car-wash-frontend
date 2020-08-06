import React, { useState, useEffect } from 'react'
import { getCustomer, saveCustomer } from '../../services/customersApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import { useParams, useHistory } from 'react-router-dom'

const CustomersEdit = () => {
  let [localCustomer, setLocalCustomer] = useState({})
  let [loading, setLoading] = useState(true)

  const history = useHistory()
  let { id } = useParams()

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  const save = async () => {
    // eslint-disable-next-line no-unused-vars
    let res = await saveCustomer(localCustomer.id, localCustomer)
    history.push('/')
  }

  useEffect(() => {
    const handleFetchCustomer = async () => {
      let res = await getCustomer(id)
      setLocalCustomer(res)
      setLoading(false)
    }
    handleFetchCustomer()
  }, [id])

  return (
    <div>
      {!loading ? (
        <BasicForm
          editRecordMethod={editRecordMethod}
          record={localCustomer}
          saveFormData={save}
          editableKeys={['name', 'email', 'contact_number']}
          valueTransformations={['', '', '']}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersEdit
