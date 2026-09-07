import React, { useState, useEffect } from 'react'
import { validate } from '../../lib/validate'
import { customerSchema } from '../../lib/schemas'
import BasicForm from '../../components/Forms/BasicForm'
import { postCustomer } from '../../services/customersApi'
import { useLocation, useHistory } from 'react-router-dom'
import type { Customer } from '../../types'

const SalesNew = () => {
  const history = useHistory()
  let [loading, setLoading] = useState(false)
  let [inputValue, setInputValue] = useState('')
  let [localCustomer, setLocalCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    contact_number: '',
  })

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()
  useEffect(() => {
    setLocalCustomer({
      name: query.get('name'),
      contact_number: query.get('contact'),
    })
  }, [])

  const save = async () => {
    let valid = validate(schema, localCustomer)
    if (valid) {
      setLoading(true)
      let res = await postCustomer(localCustomer)
      setLoading(false)
      history.push(`/sales/${res.id}/vehicles/new`)
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  const schema = customerSchema

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <div>
          <BasicForm
            editRecordMethod={editRecordMethod}
            record={localCustomer}
            saveFormData={save}
            editableKeys={['name', 'email', 'contact_number']}
            valueTransformations={['', '', '', '']}
          />
        </div>
      ) : (
          ''
        )}
    </div>
  )
}

export default SalesNew
