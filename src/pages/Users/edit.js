import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { getCustomer, saveSystemUsers } from '../../services/customersApi'
import BasicForm from '../../components/Forms/BasicForm'

const UserEdit = () => {
  let [localCustomer, setLocalCustomer] = useState({})
  let [loading, setLoading] = useState(true)
  const history = useHistory()
  let { id } = useParams()
  let [selected, setSelected] = useState('')

  useEffect(() => {
    const handleFetchCustomer = async () => {
      let res = await getCustomer(id)
      setLocalCustomer(res)
      setLoading(false)
      if (res.roles.includes('manager')) {
        setSelected('manager')
      } else if (res.roles.includes('salesperson')) {
        setSelected('salesperson')
      } else if (res.roles.includes('customer')) {
        setSelected('customer')
      }
    }
    handleFetchCustomer()
  }, [id])

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  const save = async (id, body) => {
    // let valid = await schema.validate(localCustomer).catch((err) => {
    //   alert(err.errors)
    // })
    // eslint-disable-next-line no-unused-vars
    // if (valid) {
    let res = await saveSystemUsers(id, body)
    history.push(`/settings/users`)
    // }
  }

  let inactive =
    'text-white btn bg-4 d-flex justify-content-center align-items-center px-4 py-2'
  let active =
    'text-1 btn btn-primary d-flex justify-content-center align-items-center px-4 py-2 highlighted'

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
    let body = {}
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
    <div className="w-100">
      {!loading ? (
        <div className="max-sm mx-auto d-flex justify-content-center flex-column">
          <h2 className="text-7 mb-4">{localCustomer.name}</h2>
          <h3 className="text-7 mb-5">Select user level</h3>
          <div className="text-7 mb-3 d-flex flex-row justify-content-around">
            <button
              className={selected == 'customer' ? active : inactive}
              onClick={handleCustomerClick}
            >
              Customer
            </button>
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
          <button
            className="btn btn-primary w-25 my-5 mx-auto"
            onClick={handleSubmitClick}
          >
            Submit
          </button>
          {/* <BasicForm
            editRecordMethod={editRecordMethod}
            record={localCustomer}
            saveFormData={save}
            editableKeys={['name', 'email']}
            valueTransformations={['', '']}
          /> */}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default UserEdit
