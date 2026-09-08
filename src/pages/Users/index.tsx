import React from 'react'
import useSWR from 'swr'
import { useHistory } from 'react-router-dom'
import { getSystemUsers } from '../../services/customersApi'
import BasicTable from '../../components/Tables/BasicTable'
import { Button } from '@/components/ui/button'
import { ListSkeleton } from '../../components/Loading'

const Settings = () => {
  const history = useHistory()

  const { data, isLoading } = useSWR('the users', getSystemUsers)
  const systemUsers = data ?? []

  const editUser = (user) => {
    history.push(`users/${user.id}/edit`)
  }

  const handleAdd = () => {
    history.push('/settings/users/new')
  }

  if (isLoading) {
    return <ListSkeleton rows={5} columns={3} label="Loading the users" />
  }

  return (
        <div className="w-full">
          <div className="flex flex-wrap max-md mx-auto">
            <div className="w-full md:w-3/4"></div>
            <div className="w-full md:w-1/4 text-right">
              <Button
                className="mb-2 px-4 py-2 w-full"
                onClick={handleAdd}
              >
                Add User
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap max-md mx-auto">
            <div className="w-full">
              <BasicTable
                records={systemUsers}
                fields={['name', 'email', 'roles']}
                headings={['name', 'email', 'roles']}
                renderActions={(user) => (
                  <Button variant="link" onClick={() => editUser(user)}>
                    Edit User
                  </Button>
                )}
              />
            </div>
          </div>
        </div>
  )
}

export default Settings
