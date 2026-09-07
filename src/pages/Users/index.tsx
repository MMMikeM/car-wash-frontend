import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getSystemUsers } from '../../services/customersApi'
import BasicTable from '../../components/Tables/BasicTable'

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
        <div className="w-100">
          <div className="row max-md mx-auto">
            <div className="col-md-9"></div>
            <div className="col-md-3 text-right">
              <button
                className="btn btn-primary mb-2 px-4 py-2 w-100"
                onClick={handleAdd}
              >
                Add User
              </button>
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
                  <button
                    className="link-primary btn btn-link py-0 border-0 d-block button-to-link"
                    onClick={(e) => editUser(e)}
                  >
                    Edit User
                  </button>,
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
