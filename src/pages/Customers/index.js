import React, { useState, useEffect } from 'react'
import { getCustomers } from '../../services/customersApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory } from 'react-router-dom'

const CustomersIndex = () => {
  const history = useHistory()
  let [localCustomers, setLocalCustomers] = useState([])
  // let [filteredCustomers, setFilteredCustomers] = useState([])
  let [loading, setLoading] = useState(true)

  const handleFetchCustomers = async () => {
    let res = await getCustomers()
    setLocalCustomers(res)
    setLoading(false)
  }

  useEffect(() => {
    handleFetchCustomers()
  }, [])

  const addVehicle = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/vehicles/new`)
  }

  // const handleSearchCustomers = async () => {
  //   let res = await searchCustomer()
  //   setFilteredCustomers(res)
  // }

  let addWash = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/washes/`)
  }

  return (
    <div>
      {!loading ? (
        <BasicTable
          rowType={'customers'}
          records={localCustomers}
          headings={[
            'name',
            'email',
            'contact_number',
            'vehicles/registration_number',
          ]}
          extraButtons={[
            <button
              className="link-primary btn btn-link py-0 border-0 d-block button-to-link"
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
          ]}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersIndex
