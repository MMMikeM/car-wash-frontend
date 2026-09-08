import React, { useState } from 'react'
import useSWR from 'swr'
import { getCustomer, saveCustomer } from '../../services/customersApi'
import { useParams, useNavigate } from 'react-router-dom'
import { CustomerForm, schema } from './form'
import type { Customer } from '../../types'
import { validate } from '../../lib/validate'
import { reportError } from '@/lib/reportError'
import { Button } from '@/components/ui/button'
import { FormSkeleton } from '../../components/Loading'

const CustomersEdit = () => {
  const [draft, setDraft] = useState<Partial<Customer>>()

  const navigate = useNavigate()
  let { id } = useParams()

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setDraft(tempRecord)
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
      navigate(`/customers/${localCustomer.id}`)
    }
  }

  const { data, isLoading } = useSWR(['the customer', id], () => getCustomer(id))
  const localCustomer: Partial<Customer> = draft ?? data ?? {}

  let handleClick = () => {
    navigate(`/settings/users/${id}/edit`)
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <FormSkeleton fields={5} label="Loading the customer" />
      </div>
    )
  }

  return (
    <div className="w-full">
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
    </div>
  )
}

export default CustomersEdit
