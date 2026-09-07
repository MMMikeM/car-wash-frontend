import React, { useState, useEffect } from 'react'
import { searchCustomer } from '../../services/customersApi'
import { z } from 'zod'
import BasicTable from '../../components/Tables/BasicTable'

import { useLocation, useHistory, useParams } from 'react-router-dom'
import type { Customer } from '../../types'
import { Button } from '@/components/ui/button'

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
    <div className="w-full">
      <div className="flex flex-row justify-center flex-wrap">
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
          <p className="text-destructive">{error}</p>
          <Button onClick={() => history.goBack()}>
            Go Back
          </Button>
        </div>
      ) : (
        <div className="max-md mx-auto search">
          {localCustomers.length === 0 ? (
            <h4 className="text-white">No user found</h4>
          ) : (
            <BasicTable
              records={localCustomers}
              fields={['name', 'vehicles/registration_number', 'contact_number']}
              headings={['name', 'vehicles/registration_number', 'contact_number']}
              renderActions={(customer) => (
                <>
                  <Button
                    variant="link"
                    onClick={() =>
                      history.push(`/sales/${customer.id}/vehicles/new`)
                    }
                  >
                    Add Registration
                  </Button>
                  <Button
                    variant="link"
                    onClick={() =>
                      history.push(`/customers/${customer.id}/washes/new`)
                    }
                  >
                    Add Wash
                  </Button>
                </>
              )}
            />
          )}

          <div className="flex justify-between mt-2">
            <Button className="px-5" onClick={redirect}>
              Create new customer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchCustomer
