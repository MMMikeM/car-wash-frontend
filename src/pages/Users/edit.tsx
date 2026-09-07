import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { getCustomer, saveSystemUsers } from '../../services/customersApi'
import type { Customer } from '../../types'
import { Button } from '@/components/ui/button'
import { reportError } from '@/lib/reportError'
import { FormSkeleton } from '../../components/Loading'

const UserEdit = () => {
  let [localCustomer, setLocalCustomer] = useState<Partial<Customer>>({})
  let [loading, setLoading] = useState(true)
  const history = useHistory()
  let { id } = useParams()
  let [selected, setSelected] = useState('')

  useEffect(() => {
    const handleFetchCustomer = async () => {
      try {
        let res = await getCustomer(id)
        setLocalCustomer(res)
        if (res.roles.includes('manager')) {
          setSelected('manager')
        } else if (res.roles.includes('salesperson')) {
          setSelected('salesperson')
        } else if (res.roles.includes('customer')) {
          setSelected('customer')
        }
      } catch (error) {
        reportError(error, 'load the user')
      } finally {
        setLoading(false)
      }
    }
    handleFetchCustomer()
  }, [id])

  const save = async (id, body) => {
    // let valid = await schema.validate(localCustomer).catch((err) => {
    //   alert(err.errors)
    // })
    // if (valid) {
    try {
      await saveSystemUsers(id, body)
    } catch (error) {
      reportError(error, 'save the user')
      return
    }
    history.push(`/settings/users`)
    // }
  }

  let inactive = 'text-white bg-4 px-4 py-2'
  let active = 'text-1 px-4 py-2 highlighted'

  let handleCustomerClick = () => {
    setSelected('customer')
  }
  let handleSalespersonClick = () => {
    setSelected('salesperson')
  }
  let handleManagerClick = () => {
    setSelected('manager')
  }

  let handleSubmitClick = () => {
    let body: { roles: string[] } = { roles: [] }
    if (selected === 'manager') {
      body.roles = ['manager', 'salesperson']
    } else if (selected === 'salesperson') {
      body.roles = ['salesperson']
    } else if (selected === 'customer') {
      body.roles = []
    }
    save(id, body)
  }

  return (
    <div className="w-full">
      {loading ? (
        <FormSkeleton fields={2} label="Loading the user" />
      ) : (
        <div className="max-xs mx-auto flex justify-center flex-col bg-3 py-4 rounded">
          <div className="px-2 border-b border-primary mb-4">
            <h2 className="text-white mb-3 px-4">{localCustomer.name}</h2>
          </div>
          <div className="px-2">
            <h4 className="text-9 mb-4 px-4">Select user level</h4>
            <div className="text-7 pt-3 flex flex-row justify-around">
              <Button
                variant={selected == 'customer' ? 'default' : 'ghost'}
                className={selected == 'customer' ? active : inactive}
                onClick={handleCustomerClick}
              >
                Customer
              </Button>
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
            <div className="px-3">
              <Button
                className="w-full mt-5 mb-2 mx-auto"
                onClick={handleSubmitClick}
              >
                Submit
              </Button>
            </div>
            {/* <BasicForm
            editRecordMethod={editRecordMethod}
            record={localCustomer}
            saveFormData={save}
            editableKeys={['name', 'email']}
            valueTransformations={['', '']}
          /> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserEdit
