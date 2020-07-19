import React, { useState } from 'react'
import { searchCustomer } from '../../services/customersApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory } from 'react-router-dom'

const CustomersSearch = () => {
  let [searchTerm, setSearchTerm] = useState('')
  let [selectValue, setSelectValue] = useState('name')
  let [localCustomers, setLocalCustomers] = useState([])

  const history = useHistory()

  const search = async (term, value) => {
    let res = await searchCustomer(term, value)
    setLocalCustomers(res)
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    console.log(searchTerm)
  }

  const addVehicle = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/vehicles/new`)
  }

  return (
    <div>
      <select value={searchTerm} onChange={handleChange}>
        <option value="name">Name</option>
        <option value="registration_number">Registration Number</option>
        <option value="email">Email</option>
        <option value="contact_number">Contact Number</option>
      </select>
      <input onChange={(e) => setSelectValue(e.target.value)}></input>
      <button onClick={() => search(searchTerm, selectValue)}>Search</button>
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
          <button onClick={(e) => addVehicle(e)}>Add Vehicle</button>,
        ]}
      />
    </div>
  )
}

export default CustomersSearch
