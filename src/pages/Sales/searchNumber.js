import React, { useState, useEffect } from 'react'
import { searchCustomer } from '../../services/customersApi.js'
import * as yup from 'yup'

import { useLocation, useHistory, useParams } from 'react-router-dom'

const SearchNum = () => {
  let [inputValue, setInputValue] = useState('')
  let [number, setNumber] = useState('')
  let [localCustomers, setLocalCustomers] = useState([])
  let [isLoaded, setIsLoaded] = useState(false)
  const history = useHistory()
  let { registrationNumber } = useParams()

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()

  const search = async (input) => {
    setNumber(input)
    let res = await searchCustomer('contact_number', input)
    setLocalCustomers(res)
    setIsLoaded(true)
  }

  useEffect(() => {
    search(query.get('contact'))
  }, [])

  const schema = yup
    .string()
    .min(3, 'Please enter at least 3 characters')
    .required('Please enter a valid name')

  const redirect = async () => {
    let valid = await schema.validate(inputValue).catch((err) => {
      alert(err.errors)
    })
    if (valid) {
      history.push(
        `/new_customer/q?contact=${query.get(
          'contact'
        )}&registration=${registrationNumber}&name=${inputValue}`
      )
    }
  }

  return (
    <div className="w-100 mt-4">
      {isLoaded ? (
        <div className="max-sm mx-auto">
          {localCustomers.length === 0 ? (
            <h4 className="text-white">No user found</h4>
          ) : (
            ''
          )}
          {localCustomers.map((customer) => {
            return (
              <div className="text-white d-flex justify-content-between align-items-center mb-3 bg-3 px-4 py-2">
                <h5 className="mt-2">{customer.name}</h5>
                <button
                  className={'btn btn-primary'}
                  onClick={() =>
                    history.push(`/customers/${customer.id}/washes/new`)
                  }
                >
                  Add Wash
                </button>
              </div>
            )
          })}

          <input
            placeholder={'Enter customer name'}
            className="form-control bg-2 border-0 text-6 mb-3 my-4 border-bottom rounded-0 border-primary"
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="d-flex justify-content-between mt-2">
            <button className="btn btn-primary px-5" onClick={redirect}>
              Create new customer
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default SearchNum
