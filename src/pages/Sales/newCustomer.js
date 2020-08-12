import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import BasicForm from '../../components/Forms/BasicForm'
import { postCustomer } from '../../services/customersApi.js'
import { useLocation, useHistory } from 'react-router-dom'

const SalesNew = () => {
  const history = useHistory()
  let [loading, setLoading] = useState(false)
  let [inputValue, setInputValue] = useState('')
  let [localCustomer, setLocalCustomer] = useState({
    name: '',
    email: '',
    contact_number: '',
    vehicles_attributes: [
      {
        registration_number: '',
      },
    ],
  })

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()
  useEffect(() => {
    setLocalCustomer({
      name: query.get('name'),
      contact_number: query.get('contact'),
      vehicles_attributes: [{ registration_number: query.get('registration') }],
    })
  }, [])

  const save = async () => {
    let valid = await schema.validate(localCustomer).catch((err) => {
      alert(err.errors)
    })
    if (valid) {
      setLoading(true)
      // eslint-disable-next-line no-unused-vars
      let res = await postCustomer(localCustomer)
      setLoading(false)
      history.push(`/customers/${res.id}`)
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  const schema = yup.object().shape({
    name: yup.string().required('Please enter a valid name'),
    email: yup.string().email().required('Please enter a valid email address'),
    contact_number: yup
      .string()
      .matches(/0\d{9}/g, 'Numbers must begin with 0 and be 10 digits long'),
  })

  let update = (e) => {
    setInputValue(e.target.value)
    let registration = { registration_number: e.target.value }
    localCustomer.vehicles_attributes[0] = registration
    console.log(localCustomer)
  }

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <div>
          <div className="mb-2">
            <label className="text-9">Registration Number:</label>
            <input
              value={localCustomer.vehicles_attributes[0].registration_number}
              onChange={(e) => update(e)}
              className="form-control bg-2 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
            ></input>
          </div>
          <BasicForm
            editRecordMethod={editRecordMethod}
            record={localCustomer}
            saveFormData={save}
            editableKeys={['name', 'email', 'contact_number']}
            valueTransformations={['', '', '']}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default SalesNew
