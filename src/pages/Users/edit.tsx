import React, { useState, Suspense } from 'react'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router-dom'
import { getCustomer, saveSystemUsers } from '../../services/customersApi'
import { Button } from '@/components/ui/button'
import { reportError } from '@/lib/reportError'
import { FormSkeleton } from '../../components/Loading'

const currentRole = (roles: string[] = []) => {
  if (roles.includes('manager')) return 'manager'
  if (roles.includes('salesperson')) return 'salesperson'
  if (roles.includes('customer')) return 'customer'
  return ''
}

const UserEditContent = () => {
  const navigate = useNavigate()
  let { id } = useParams()

  const { data: localCustomer } = useSWR(['the user', id], () => getCustomer(id))
  const [chosen, setChosen] = useState<string>()
  const selected = chosen ?? currentRole(localCustomer.roles)

  const save = async (userId, body) => {
    try {
      await saveSystemUsers(userId, body)
    } catch (error) {
      reportError(error, 'save the user')
      return
    }
    navigate(`/settings/users`)
  }

  let inactive = 'text-white bg-4 px-4 py-2'
  let active = 'text-1 px-4 py-2 highlighted'

  let handleCustomerClick = () => {
    setChosen('customer')
  }
  let handleSalespersonClick = () => {
    setChosen('salesperson')
  }
  let handleManagerClick = () => {
    setChosen('manager')
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
    </div>
  )
}

const UserEdit = () => (
  <Suspense fallback={<FormSkeleton fields={2} label="Loading the user" />}>
    <UserEditContent />
  </Suspense>
)

export default UserEdit
