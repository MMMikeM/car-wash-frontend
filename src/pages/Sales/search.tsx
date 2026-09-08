import React, { useState, useEffect } from 'react'
import { searchCustomer } from '../../services/customersApi'
import BasicTable from '../../components/Tables/BasicTable'

import { useHistory } from 'react-router-dom'
import type { Customer } from '../../types'
import { useQueryParam } from '@/hooks/useQueryParam'
import { Button } from '@/components/ui/button'
import { ListSkeleton } from '../../components/Loading'


const SearchCustomer = () => {
  let [localCustomers, setLocalCustomers] = useState<Customer[]>([])
  let [isLoaded, setIsLoaded] = useState(false)
  let [error, setError] = useState(null)
  const history = useHistory()

  const contactNumber = useQueryParam('contact_number')


  useEffect(() => {
    const search = async (input) => {
      setError(null)
      try {
        let res = await searchCustomer('contact_number', input)
        setLocalCustomers(res.data || [])
        setIsLoaded(true)
      } catch {
        setError('Failed to search. Please try again.')
        setIsLoaded(true)
      }
    }

    search(contactNumber)
  }, [contactNumber])

  const redirect = async () => {
    history.push(`/new_customer/q?contact=${contactNumber}`)
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
        <ListSkeleton rows={3} columns={3} label="Searching" />
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
