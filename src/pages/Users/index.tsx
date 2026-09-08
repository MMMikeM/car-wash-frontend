import React, { Suspense } from 'react'
import useSWR from 'swr'
import { useNavigate } from 'react-router-dom'
import { getSystemUsers } from '../../services/customersApi'
import BasicTable from '../../components/Tables/BasicTable'
import { Button } from '@/components/ui/button'
import { ListSkeleton } from '../../components/Loading'

const SettingsContent = () => {
  const navigate = useNavigate()

  const { data } = useSWR('the users', getSystemUsers)
  const systemUsers = data

  const editUser = (user) => {
    navigate(`users/${user.id}/edit`)
  }

  const handleAdd = () => {
    navigate('/settings/users/new')
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

const Settings = () => (
  <Suspense fallback={<ListSkeleton rows={5} columns={3} label="Loading the users" />}>
    <SettingsContent />
  </Suspense>
)

export default Settings
