import React, { useState } from 'react'
import { postCustomer, saveSystemUsers } from '../../services/customersApi'
import { CustomerForm, schema } from './form'
import { useHistory } from 'react-router-dom'
import type { Customer } from '../../types'
import { validate } from '../../lib/validate'
import { reportError } from '@/lib/reportError'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

const UserNew = () => {
  let [localCustomer, setLocalCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    contact_number: '',
  })
  let [roles, setRoles] = useState({ roles: [] })
  let [loading, setLoading] = useState(false)
  let [selected, setSelected] = useState('')

  const history = useHistory()

  const save = async () => {
    if (!selected) {
      toast.error('Please select a user level')
    } else {
      let valid = validate(schema, localCustomer)
      if (valid) {
        setLoading(true)
        try {
          let resCustomer = await postCustomer(localCustomer)
          await saveSystemUsers(resCustomer.id, roles)
          history.push(`/`)
        } catch (error) {
          // setLoading was never reset on failure, leaving the form blank.
          reportError(error, 'create the user')
        } finally {
          setLoading(false)
        }
      }
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  let inactive = 'text-white bg-4 px-4 py-2'
  let active = 'text-1 px-4 py-2 highlighted'

  let handleSalespersonClick = () => {
    setRoles({ roles: ['salesperson'] })
    setSelected('salesperson')
  }
  let handleManagerClick = () => {
    setRoles({ roles: ['manager', 'salesperson'] })
    setSelected('manager')
  }

  return (
    <div className="w-1/2 mx-auto flex flex-col">
        <div>
          <div className="text-7 mb-3 flex flex-row justify-around">
            <Button
                variant={selected == 'salesperson' ? 'default' : 'ghost'}
                className={selected == 'salesperson' ? active : inactive}
              onClick={handleSalespersonClick}
            >
              Salesperson
            </Button>
            <Button
                variant={selected == 'manager' ? 'default' : 'ghost'}
                className={selected == 'manager' ? active : inactive}
              onClick={handleManagerClick}
            >
              Manager
            </Button>
          </div>

          <CustomerForm
            editRecordMethod={editRecordMethod}
            localCustomer={localCustomer}
            save={save}
            saving={loading}
          />
        </div>
    </div>
  )
}

export default UserNew
