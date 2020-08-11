import React, { useState } from 'react'
import * as yup from 'yup'
import { useHistory } from 'react-router-dom'

const SalesHome = () => {
  let [inputValue, setInputValue] = useState('')
  const history = useHistory()

  const redirect = async () => {
    let valid = await schema.validate(inputValue).catch((err) => {
      alert(err.errors)
    })
    if (valid) {
      history.push(`/search/q?registration=${inputValue}`)
    }
  }

  const schema = yup
    .string()
    .min(3, 'Please enter at least 3 characters')
    .required('Please enter a valid registration number')

  return (
    <div className="w-100 mt-5">
      <div className="max-sm mx-auto ">
        <input
          placeholder={'Search customer registration'}
          className="form-control bg-2 border-0 text-6 mb-3 my-4 border-bottom rounded-0 border-primary"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="d-flex justify-content-between mt-2">
          <button className="btn btn-primary px-5" onClick={redirect}>
            Search
          </button>

          <button
            className="btn btn-primary px-5"
            onClick={() => alert('fix me')}
          >
            Create new customer
          </button>
        </div>
      </div>
    </div>
  )
}

export default SalesHome
