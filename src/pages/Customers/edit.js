import React, { useState, useEffect } from 'react'
import { getCustomer, saveCustomer } from '../../services/customersApi.js'
import { useParams, useHistory } from 'react-router-dom'
import { CustomerForm, schema } from './form'

const CustomersEdit = () => {
  let [localCustomer, setLocalCustomer] = useState({})
  let [loading, setLoading] = useState(true)

  const history = useHistory()
  let { id } = useParams()

  const editRecordMethod = (record, key, value) => {
    console.log(record, key, value)
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  const save = async () => {
    let valid = await schema.validate(localCustomer).catch((err) => {
      alert(err.errors)
    })
    // eslint-disable-next-line no-unused-vars
    if (valid) {
      let tempCustomer = localCustomer
      console.log(tempCustomer)
      let res = await saveCustomer(localCustomer.id, localCustomer)
      history.push(`/customers/${localCustomer.id}`)
    }
  }

  useEffect(() => {
    const handleFetchCustomer = async () => {
      let res = await getCustomer(id)
      setLocalCustomer(res)
      setLoading(false)
    }
    handleFetchCustomer()
  }, [id])

  let handleClick = () => {
    history.push(`/settings/users/${id}/edit`)
  }

  return (
    <div className="w-100">
      {!loading ? (
        <div className="max-sm mx-auto">
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary my-3 mr-4" onClick={handleClick}>
              Convert To User
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

export default CustomersEdit
