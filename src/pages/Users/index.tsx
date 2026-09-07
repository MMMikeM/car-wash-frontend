import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getSystemUsers } from '../../services/customersApi'
import { reportError } from '@/lib/reportError'
import BasicTable from '../../components/Tables/BasicTable'
import { Button } from '@/components/ui/button'

const Settings = () => {
  let [systemUsers, setSystemUsers] = useState([])
  let [loading, setLoading] = useState(false)
  const history = useHistory()

  const handleFetchSystemUsers = async () => {
    try {
      let res = await getSystemUsers()
      setSystemUsers(res)
    } catch (error) {
      reportError(error, 'load the users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchSystemUsers()
  }, [])

  const editUser = (user) => {
    history.push(`users/${user.id}/edit`)
  }

  const handleAdd = () => {
    history.push('/settings/users/new')
  }

  return (
    <>
      {!loading ? (
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
      ) : (
        ''
      )}
    </>
  )
}

export default Settings
