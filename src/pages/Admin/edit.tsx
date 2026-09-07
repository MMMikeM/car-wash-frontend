import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getSystemUsers } from '../../services/customersApi'
import BasicTable from '../../components/Tables/BasicTable'
import { Button } from '@/components/ui/button'

const Settings = () => {
  let [systemUsers, setSystemUsers] = useState([])
  let [loading, setLoading] = useState(false)
  const history = useHistory()

  const handleFetchSystemUsers = async () => {
    let res = await getSystemUsers()
    setSystemUsers(res)
    setLoading(false)
  }

  useEffect(() => {
    handleFetchSystemUsers()
  }, [])

  const editUser = (user) => {
    history.push(`/user/${user.id}/edit`)
  }

  return (
    <>
      {!loading ? (
        <div className="row">
          <div className="col-md-12">
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
      ) : (
        ''
      )}
    </>
  )
}

export default Settings
