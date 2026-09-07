import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import BasicForm from '../../components/Forms/BasicForm'
import { postCustomer } from '../../services/customersApi'
import { useLocation, useHistory } from 'react-router-dom'

const SalesNew = () => {
  const history = useHistory()
  let [loading, setLoading] = useState(false)
  let [inputValue, setInputValue] = useState('')
  let [localCustomer, setLocalCustomer] = useState({
    name: '',
    email: '',
    contact_number: '',
  })

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()
  useEffect(() => {
    setLocalCustomer({
      name: query.get('name'),
      contact_number: query.get('contact'),
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
      history.push(`/sales/${res.id}/vehicles/new`)
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalCustomer(tempRecord)
  }

  const schema = yup.object().shape({
    name: yup.string().required('Please enter a valid name'),
    email: yup.string().email('Please enter a valid email address'),
    contact_number: yup
      .string()
      .matches(/^0\d{9}$/g, 'Numbers must begin with 0 and be 10 digits long and contain no spaces')
      .strict()
  })

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <div>
          <BasicForm
            editRecordMethod={editRecordMethod}
            record={localCustomer}
            saveFormData={save}
            editableKeys={['name', 'email', 'contact_number']}
            valueTransformations={['', '', '', '']}
          />
        </div>
      ) : (
          ''
        )}
    </div>
  )
}

export default SalesNew
