import React, { useState } from 'react'
import { postCustomer, saveSystemUsers } from '../../services/customersApi.js'
import { CustomerForm, schema } from './form'
import { useHistory } from 'react-router-dom'

const UserNew = () => {
  let [localCustomer, setLocalCustomer] = useState({
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
      alert('Please select a user level')
    } else {
      let valid = await schema.validate(localCustomer).catch((err) => {
        alert(err.errors)
      })
      if (valid) {
        setLoading(true)
        // eslint-disable-next-line no-unused-vars
        let resCustomer = await postCustomer(localCustomer)
        let resUser = await saveSystemUsers(resCustomer.id, roles)
        history.push(`/`)
      }
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  let inactive =
    'text-white btn bg-4 d-flex justify-content-center align-items-center px-4 py-2'
  let active =
    'text-1 btn btn-primary d-flex justify-content-center align-items-center px-4 py-2 highlighted'

  let handleSalespersonClick = () => {
    let tempRecord = {}
    tempRecord.roles = ['salesperson']
    setRoles(tempRecord)
    setSelected('salesperson')
  }
  let handleManagerClick = () => {
    let tempRecord = {}
    tempRecord.roles = ['manager', 'salesperson']
    setRoles(tempRecord)
    setSelected('manager')
  }

  let handleSubmitClick = () => {
    let body = {}
    if (selected === 'manager') {
      body.roles = ['manager', 'salesperson']
    } else if (selected === 'salesperson') {
      body.roles = ['salesperson']
    }
    save(body)
  }

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <div>
          <div className="text-7 mb-3 d-flex flex-row justify-content-around">
            <button
              className={selected == 'salesperson' ? active : inactive}
              onClick={handleSalespersonClick}
            >
              Salesperson
            </button>
            <button
              className={selected == 'manager' ? active : inactive}
              onClick={handleManagerClick}
            >
              Manager
            </button>
          </div>

          <CustomerForm
            editRecordMethod={editRecordMethod}
            localCustomer={localCustomer}
            save={save}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default UserNew
