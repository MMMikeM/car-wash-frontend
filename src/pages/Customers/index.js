import React, { useState, useEffect } from 'react'
import { getCustomers } from '../../services/customersApi.js'
import BasicTable from '../../components/Tables/BasicTable'

const CustomersIndex = () => {
  let [localCustomers, setLocalCustomers] = useState([])
  let [loading, setLoading] = useState(true)

  const handleFetchCustomers = async () => {
    let res = await getCustomers()
    setLocalCustomers(res)
    setLoading(false)
  }

  useEffect(() => {
    handleFetchCustomers()
  }, [])

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
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersIndex
