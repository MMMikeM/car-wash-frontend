import React, { useState } from 'react'
import { z } from 'zod'
import { validate } from '../../lib/validate'
import { useHistory } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const SalesHome = () => {
  let [inputValue, setInputValue] = useState('')
  const history = useHistory()

  const redirect = async () => {
    let valid = validate(schema, inputValue)
    if (valid) {
      history.push(`/search/q?contact_number=${inputValue}`)
    }
  }

  const schema = z
    .string({ error: 'Please enter a valid registration number' })
    .min(3, 'Please enter at least 3 characters')

  return (
    <div className="w-100 mt-5">
      <div className="flex flex-row justify-content-center flex-wrap">
        <img
          alt="Company logo"
          src="/logo.png"
          style={{ width: '200px' }}
          className="mx-auto mb-5"
        />
      </div>
      <div className="max-sm mx-auto ">
        <input
          placeholder={'Search customer contact number'}
          className="form-control bg-2 border-0 text-6 mb-3 my-4 border-bottom rounded-0 border-primary"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="flex justify-content-between mt-2">
          <Button className="px-4 py-2" onClick={redirect}>
            Search
          </Button>

          <Button
            className="px-4 py-2"
            onClick={() => history.push('/customers/e92d521d-0628-4cb3-8252-02d5d65272e5/washes/new/')}
          >
            No loyalty programme
          </Button>

          {/* <Button
            className="px-4 py-2"
            onClick={() => history.push('/new_customer/')}
          >
            Create new customer
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default SalesHome
