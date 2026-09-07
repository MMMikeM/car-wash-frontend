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

  const editUser = (e) => {
    history.push(`users/${e.currentTarget.parentNode.id}/edit`)
  }

  const handleAdd = () => {
    history.push('/settings/users/new')
  }

  return (
    <>
      {!loading ? (
        <div className="w-full">
          <div className="row max-md mx-auto">
            <div className="col-md-9"></div>
            <div className="col-md-3 text-right">
              <Button
                className="mb-2 px-4 py-2 w-full"
                onClick={handleAdd}
              >
                Add User
              </Button>
            </div>
          </div>
          <div className="row max-md mx-auto">
            <div className="col-md-12">
              <BasicTable
                rowType={'customers'}
                records={systemUsers}
                fields={['name', 'email', 'roles']}
                headings={['name', 'email', 'roles']}
                crudEnabled={false}
                extraButtons={[
                  <Button variant="link"
                    className="text-primary hover:text-primary/80 py-0 border-0 d-block button-to-link"
                    onClick={(e) => editUser(e)}
                  >
                    Edit User
                  </Button>,
                ]}
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
