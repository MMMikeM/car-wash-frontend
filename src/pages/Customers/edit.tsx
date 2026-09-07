import React, { useState, useEffect } from 'react'
import { getCustomer, saveCustomer } from '../../services/customersApi'
import { useParams, useHistory } from 'react-router-dom'
import { CustomerForm, schema } from './form'
import type { Customer } from '../../types'
import { validate } from '../../lib/validate'

const CustomersEdit = () => {
  let [localCustomer, setLocalCustomer] = useState<Partial<Customer>>({})
  let [loading, setLoading] = useState(true)

  const history = useHistory()
  let { id } = useParams()

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  const save = async () => {
    let valid = validate(schema, localCustomer)
    if (valid) {
      const { name, email, contact_number, total_points, loyalty_enabled } = localCustomer
      await saveCustomer(localCustomer.id, { name, email, contact_number, total_points, loyalty_enabled })
      history.push(`/customers/${localCustomer.id}`)
    }
  }

  useEffect(() => {
    const handleFetchCustomer = async () => {
      let res = await getCustomer(id)
      setLocalCustomer(res)
      setLoading(false)
    }
    handleFetchCustomer()
  }, [id])

  let handleClick = () => {
    history.push(`/settings/users/${id}/edit`)
  }

  return (
    <div className="w-100">
      {!loading ? (
        <div className="max-sm mx-auto">
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary my-3 mr-4" onClick={handleClick}>
              Convert To User
            </button>
          </div>
          <CustomerForm
            editRecordMethod={editRecordMethod}
            localCustomer={localCustomer}
            save={save}
          />
        </div>
      ) : (
          ''
        )}
    </div>
  )
}

export default CustomersEdit
