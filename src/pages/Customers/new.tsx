import React, { useState } from 'react'
import { postCustomer } from '../../services/customersApi'
import { CustomerForm, schema} from './form'
import { useHistory } from 'react-router-dom'
import { validate } from '../../lib/validate'
import { reportError } from '@/lib/reportError'

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
      try {
        let res = await postCustomer(localCustomer)
        history.push(`/customers/${res.id}`)
      } catch (error) {
        reportError(error, 'create the customer')
      } finally {
        setLoading(false)
      }
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  return (
    <div className="w-1/2 mx-auto flex flex-col">
        <CustomerForm
          saving={loading}
          editRecordMethod={editRecordMethod}
          localCustomer={localCustomer}
          save={save}
        />
    </div>
  )
}

export default CustomersNew
