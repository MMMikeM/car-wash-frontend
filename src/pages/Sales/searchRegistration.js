import React, { useState, useEffect } from 'react'
import { searchCustomer } from '../../services/customersApi.js'
import { useLocation, useHistory } from 'react-router-dom'
import * as yup from 'yup'

const SearchReg = () => {
  let [inputValue, setInputValue] = useState('')
  let [registration, setRegistration] = useState('')
  let [localCustomers, setLocalCustomers] = useState([])
  let [isLoaded, setIsLoaded] = useState(false)
  const history = useHistory()

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()

  const search = async (input) => {
    setRegistration(input)
    let res = await searchCustomer('registration_number', input)
    setLocalCustomers(res)
    setIsLoaded(true)
  }

  useEffect(() => {
    search(query.get('registration'))
  }, [])

  const schema = yup
    .string()
    .matches(/^0\d{9}$/g, 'Numbers must begin with 0 and be 10 digits long and contain no spaces')
    .strict()
    )

const redirect = async () => {
  let valid = await schema.validate(inputValue).catch((err) => {
    alert(err.errors)
  })
  if (valid) {
    history.push(`/search/${registration}/q?contact=${inputValue}`)
  }
}

return (
  <div className="w-100 mt-4">
    <div className="d-flex flex-row justify-content-center flex-wrap">
      <img
        alt="Company logo"
        src="/public/logo.png"
        style={{ width: '200px' }}
        className="mx-auto mb-5"
      />
    </div>
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
          placeholder={'Search customer contact number'}
          className="form-control bg-2 border-0 text-6 mb-3 my-4 border-bottom rounded-0 border-primary"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="d-flex justify-content-between mt-2">
          <button className="btn btn-primary px-5" onClick={redirect}>
            Search
            </button>

          <button
            className="btn btn-primary px-5"
            onClick={() => history.push('/new_customer/')}
          >
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

export default SearchReg
