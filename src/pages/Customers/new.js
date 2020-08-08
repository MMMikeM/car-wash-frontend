import React, { useState } from 'react'
import { postCustomer } from '../../services/customersApi.js'
import { CustomerForm, schema} from './form'
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
    let valid = await schema.validate(localCustomer).catch((err) => {alert(err.errors)})
    if (valid){ 
      setLoading(true)
      // eslint-disable-next-line no-unused-vars
      let res = await postCustomer(localCustomer)
      setLoading(false)
      history.push(`/customers/${res.id}`)
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <CustomerForm
          editRecordMethod={editRecordMethod}
          localCustomer={localCustomer}
          save={save}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersNew
