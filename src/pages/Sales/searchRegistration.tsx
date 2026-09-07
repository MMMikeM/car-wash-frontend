import React, { useState, useEffect } from 'react'
import { searchCustomer } from '../../services/customersApi'
import { useLocation, useHistory } from 'react-router-dom'
import { validate } from '../../lib/validate'
import { contactNumberSchema } from '../../lib/schemas'
import type { Customer } from '../../types'
import { Button } from '@/components/ui/button'

const SearchReg = () => {
  let [inputValue, setInputValue] = useState('')
  let [registration, setRegistration] = useState('')
  let [localCustomers, setLocalCustomers] = useState<Customer[]>([])
  let [isLoaded, setIsLoaded] = useState(false)
  const history = useHistory()

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()

  const search = async (input) => {
    setRegistration(input)
    let res = await searchCustomer('registration_number', input)
    setLocalCustomers(res.data || [])
    setIsLoaded(true)
  }

  useEffect(() => {
    search(query.get('registration'))
  }, [])

  const schema = contactNumberSchema

const redirect = async () => {
  let valid = validate(schema, inputValue)
  if (valid) {
    history.push(`/search/${registration}/q?contact=${inputValue}`)
  }
}

return (
  <div className="w-full mt-4">
    <div className="flex flex-row justify-center flex-wrap">
      <img
        alt="Company logo"
        src="/logo.png"
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
            <div className="text-white flex justify-between items-center mb-3 bg-3 px-4 py-2">
              <h5 className="mt-2">{customer.name}</h5>
              <Button
        
        onClick={() =>
         history.push(`/customers/${customer.id}/washes/new`)
        }
       >
                Add Wash
                </Button>
            </div>
          )
        })}

        <input
          placeholder={'Search customer contact number'}
          className="block w-full px-3 py-1.5 leading-normal bg-2 border-0 text-6 mb-3 my-4 border-b rounded-none border-primary"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="flex justify-between mt-2">
          <Button className="px-5" onClick={redirect}>
            Search
            </Button>

          <Button
            className="px-5"
            onClick={() => history.push('/new_customer/')}
          >
            Create new customer
            </Button>
        </div>
      </div>
    ) : (
        ''
      )}
  </div>
)
}

export default SearchReg
