import React, { useState, useEffect } from 'react'
import { searchCustomer } from '../../services/customersApi'
import { z } from 'zod'
import BasicTable from '../../components/Tables/BasicTable'

import { useLocation, useHistory, useParams } from 'react-router-dom'
import type { Customer } from '../../types'

const SearchCustomer = () => {
  let [inputValue, setInputValue] = useState('')
  let [number, setNumber] = useState('')
  let [localCustomers, setLocalCustomers] = useState<Customer[]>([])
  let [isLoaded, setIsLoaded] = useState(false)
  let [error, setError] = useState(null)
  const history = useHistory()
  let { registrationNumber } = useParams()

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()

  const search = async (input) => {
    setNumber(input)
    setError(null)
    try {
      let res = await searchCustomer('contact_number', input)
      setLocalCustomers(res.data || [])
      setIsLoaded(true)
    } catch (err) {
      setError('Failed to search. Please try again.')
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    search(query.get('contact_number'))
  }, [])

  const schema = z
    .string({ error: 'Please enter a valid name' })
    .min(3, 'Please enter at least 3 characters')

  const redirect = async () => {
    history.push(`/new_customer/q?contact=${query.get('contact_number')}`)
  }

  return (
    <div className="w-100">
      <div className="d-flex flex-row justify-content-center flex-wrap">
        <img
          alt="Company logo"
          src="/logo.png"
          style={{ width: '200px' }}
          className="mx-auto mb-5"
        />
      </div>
      {!isLoaded ? (
        <div className="max-md mx-auto text-center">
          <p className="text-white">Searching...</p>
        </div>
      ) : error ? (
        <div className="max-md mx-auto text-center">
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={() => history.goBack()}>
            Go Back
          </button>
        </div>
      ) : (
        <div className="max-md mx-auto search">
          {localCustomers.length === 0 ? (
            <h4 className="text-white">No user found</h4>
          ) : (
            <BasicTable
              rowType={'customers'}
              records={localCustomers}
              fields={['name', 'vehicles/registration_number', 'contact_number']}
              headings={['name', 'vehicles/registration_number', 'contact_number']}
              crudEnabled={false}
              extraButtons={[
                <button
                  className={'link-primary btn btn-link py-0 border-0 d-block button-to-link'}
                  onClick={(e) =>
                    history.push(`/sales/${(e.currentTarget.parentNode as HTMLElement).id}/vehicles/new`)
                  }
                >
                  Add Registration
                </button>,
                <button
                  className={'link-primary btn btn-link py-0 border-0 d-block button-to-link'}
                  onClick={(e) =>
                    history.push(`/customers/${(e.currentTarget.parentNode as HTMLElement).id}/washes/new`)
                  }
                >
                  Add Wash
                </button>
              ]}
            />
          )}

          <div className="d-flex justify-content-between mt-2">
            <button className="btn btn-primary px-5" onClick={redirect}>
              Create new customer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchCustomer
