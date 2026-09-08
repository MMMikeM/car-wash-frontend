import React, { useState } from 'react'
import { validate } from '../../lib/validate'
import { reportError } from '@/lib/reportError'
import { customerSchema } from '../../lib/schemas'
import BasicForm from '../../components/Forms/BasicForm'
import { postCustomer } from '../../services/customersApi'
import { useHistory } from 'react-router-dom'
import type { Customer } from '../../types'
import { useQueryParam } from '@/hooks/useQueryParam'


const SalesNew = () => {
  const history = useHistory()
  let [loading, setLoading] = useState(false)
  let [localCustomer, setLocalCustomer] = useState<Partial<Customer>>({
    name: useQueryParam('name') ?? '',
    email: '',
    contact_number: useQueryParam('contact') ?? '',
  })

  const save = async () => {
    let valid = validate(schema, localCustomer)
    if (valid) {
      setLoading(true)
      try {
        let res = await postCustomer(localCustomer)
        history.push(`/sales/${res.id}/vehicles/new`)
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

  const schema = customerSchema

  return (
    <div className="w-1/2 mx-auto flex flex-col">
        <div>
          <BasicForm
            editRecordMethod={editRecordMethod}
            record={localCustomer}
            saveFormData={save}
            saving={loading}
            editableKeys={['name', 'email', 'contact_number']}
            valueTransformations={['', '', '', '']}
          />
        </div>
    </div>
  )
}

export default SalesNew
