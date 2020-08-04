import React, { useState } from 'react'
import { searchCustomer } from '../../services/customersApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { Link, useHistory } from 'react-router-dom'

const CustomersSearch = () => {
  let [searchTerm, setSearchTerm] = useState('')
  let [selectValue, setSelectValue] = useState('registration_number')
  let [localCustomers, setLocalCustomers] = useState([])
  let [isLoaded, setIsLoaded] = useState(false)

  const history = useHistory()

  const search = async (term, value) => {
    let res = await searchCustomer(term, value)
    setLocalCustomers(res)
    setIsLoaded(true)
  }

  let addWash = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/washes/new`)
  }

  let showCustomer = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}`)
  }

  const addVehicle = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/vehicles/new`)
  }

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center w-100">
        <div className="d-flex flex-column w-50">
          <label className="text-6">Search by field</label>
          <form
            className="text-9 d-flex flex-column"
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <label className="form-check-label mt-2" htmlfor="iR1">
              <input
                className="form-check-input mr-2"
                type="radio"
                name="inlineRadioOptions"
                id="iR1"
                value="name"
              />
              Name
            </label>

            <label className="form-check-label mt-2" htmlfor="iR2">
              <input
                className="form-check-input mr-2"
                type="radio"
                name="inlineRadioOptions"
                id="iR2"
                value="registration_number"
                checked
              />
              Registration Number
            </label>

            <label className="form-check-label mt-2" htmlfor="iR3">
              <input
                className="form-check-input mr-2"
                type="radio"
                name="inlineRadioOptions"
                id="iR3"
                value="email"
              />
              Email
            </label>

            <label className="form-check-label mt-2" htmlfor="iR4">
              <input
                className="form-check-input mr-2"
                type="radio"
                name="inlineRadioOptions"
                id="iR4"
                value="contact_number"
              />
              Contact Number
            </label>
          </form>
          <input
            placeholder="Search here..."
            className="form-control bg-2 border-0 text-6 mb-3 my-4 border-bottom rounded-0 border-primary"
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
          <div className="d-flex justify-content-center mt-2">
            <button
              className="btn btn-primary px-5 mx-auto"
              onClick={() => search(selectValue, searchTerm)}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {isLoaded ? (
          <div>
            {localCustomers.length == 0 ? 
              <div className="text-center">
                <p className="text-white">No customers found</p>
                <Link className="btn btn-primary" to="/customers/new">Add customer</Link> 
              </div> :
              <BasicTable
                rowType={'customers'}
                records={localCustomers}
                headings={[
                  'name',
                  'email',
                  'contact_number',
                  'vehicles/registration_number',
                ]}
                crudEnabled={false}
                extraButtons={[
                  <button
                    className="link-primary btn btn-link py-0 border-0 d-block"
                    onClick={(e) => addVehicle(e)}
                  >
                    Add Vehicle
                  </button>,
                  <button
                    className="link-primary btn btn-link py-0 border-0 d-block button-to-link"
                    onClick={(e) => addWash(e)}
                  >
                    Add Wash
                  </button>,
                  <button
                    className="link-primary btn btn-link py-0 border-0 d-block button-to-link"
                    onClick={(e) => showCustomer(e)}
                  >
                    View
                  </button>,
                ]}
              />
            }
          </div>
        ) : (
          ''
        )}
      </div>
    </React.Fragment>
  )
}

export default CustomersSearch
