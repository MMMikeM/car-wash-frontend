import React, { useState, useEffect } from 'react'
import { getCustomer, saveCustomer } from '../../services/customersApi'
import { useParams, useHistory } from 'react-router-dom'
import { CustomerForm, schema } from './form'
import type { Customer } from '../../types'
import { validate } from '../../lib/validate'
import { reportError } from '@/lib/reportError'
import { Button } from '@/components/ui/button'

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
      try {
        await saveCustomer(localCustomer.id, { name, email, contact_number, total_points, loyalty_enabled })
      } catch (error) {
        reportError(error, 'save the customer')
        return
      }
      history.push(`/customers/${localCustomer.id}`)
    }
  }

  useEffect(() => {
    const handleFetchCustomer = async () => {
      try {
        let res = await getCustomer(id)
        setLocalCustomer(res)
      } catch (error) {
        reportError(error, 'load the customer')
      } finally {
        setLoading(false)
      }
    }
    handleFetchCustomer()
  }, [id])

  let handleClick = () => {
    history.push(`/settings/users/${id}/edit`)
  }

  return (
    <div className="w-full">
      {!loading ? (
        <div className="max-sm mx-auto">
          <div className="flex justify-end">
            <Button className="my-3 mr-4" onClick={handleClick}>
              Convert To User
            </Button>
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
