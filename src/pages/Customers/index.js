import React, { useState, useEffect } from 'react'
import { getCustomers } from '../../services/customersApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { Link, useHistory } from 'react-router-dom'

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
    history.push(`/customers/${e.currentTarget.parentNode.id}/washes/new`)
  }

  return (
    <div>
      {!loading ? (
        <div className="row">
          <div className="col-md-9"></div>
          <div className="col-md-3 text-right"> 
            <Link className="btn btn-primary mb-2" to="/customers/new">Add customer</Link> 
          </div>
          <div className="col-md-12"> 
            <BasicTable
              rowType={'customers'}
              records={localCustomers}
              fields={[
                'name',
                'email',
                'contact_number',
                'vehicles/registration_number',
              ]}
              headings={[
                'name',
                'email',
                'contact_number',
                'vehicles/registration_number',
              ]}
              crudEnabled={true}
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
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersIndex
