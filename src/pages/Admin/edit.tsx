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
    history.push(`/user/${e.currentTarget.parentNode.id}/edit`)
  }

  return (
    <>
      {!loading ? (
        <div className="row">
          <div className="col-md-12">
            <BasicTable
              rowType={'customers'}
              records={systemUsers}
              fields={['name', 'email', 'roles']}
              headings={['name', 'email', 'roles']}
              crudEnabled={false}
              extraButtons={[
                <Button variant="link"
                  className="link-primary py-0 border-0 d-block button-to-link"
                  onClick={(e) => editUser(e)}
                >
                  Edit User
                </Button>,
              ]}
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
