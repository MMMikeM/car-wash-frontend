import React, { useState, useEffect } from 'react'
import { searchCustomer } from '../../services/customersApi.js'
import * as yup from 'yup'
import BasicTable from '../../components/Tables/BasicTable'

import { useLocation, useHistory, useParams } from 'react-router-dom'

const SearchCustomer = () => {
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
    search(query.get('contact_number'))
  }, [])

  const schema = yup
    .string()
    .min(3, 'Please enter at least 3 characters')
    .required('Please enter a valid name')

  const redirect = async () => {
    history.push(`/new_customer/q?contact=${query.get('contact_number')}`)
  }

  return (
    <div className="w-100">
      <div className="d-flex flex-row justify-content-center flex-wrap">
        <img
          alt="Company logo"
          src="/public/logo.png"
          style={{ width: '200px' }}
          className="mx-auto mb-5"
        />
      </div>
      {isLoaded ? (
        <div className="max-md mx-auto search">
          {localCustomers.length === 0 ? (
            <h4 className="text-white">No user found</h4>
          ) : (
              ''
            )}
          <BasicTable
            rowType={'customers'}
            records={localCustomers}
            fields={['name', 'vehicles/registration_number', 'contact_number']}
            headings={['name', 'vehicles/registration_number', 'contact_number']}
            crudEnabled={false}
            extraButtons={[<button
              className={'link-primary btn btn-link py-0 border-0 d-block button-to-link'}
              onClick={(e) =>
                history.push(`/sales/${e.currentTarget.parentNode.id}/vehicles/new`)
              }
            >
              Add Registration
            </button>,
            <button
              className={'link-primary btn btn-link py-0 border-0 d-block button-to-link'}
              onClick={(e) =>
                history.push(`/customers/${e.currentTarget.parentNode.id}/washes/new`)
              }
            >
              Add Wash
            </button>]}
          />
          )}

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

export default SearchCustomer
