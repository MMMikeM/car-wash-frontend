import React, { useState } from 'react'
import { postCustomer } from '../../services/customersApi'
import { CustomerForm, schema} from './form'
import { useHistory } from 'react-router-dom'
import { validate } from '../../lib/validate'

const CustomersNew = () => {
  let [localCustomer, setLocalCustomer] = useState({
    name: '',
    email: '',
    contact_number: '',
    loyalty_enabled: true,
  })
  let [loading, setLoading] = useState(false)

  const history = useHistory()

  const save = async () => {
    let valid = validate(schema, localCustomer)
    if (valid){ 
      setLoading(true)
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
