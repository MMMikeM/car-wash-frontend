import React, { useState, useEffect } from 'react'
import { getCustomer } from '../../services/customersApi.js'
import { useParams, useHistory } from 'react-router-dom'

const CustomersShow = () => {
  let [localCustomer, setLocalCustomer] = useState({})
  let [loading, setLoading] = useState(true)

  const history = useHistory()
  let { id } = useParams()

  useEffect(() => {
    const handleFetchCustomer = async () => {
      let res = await getCustomer(id)
      setLocalCustomer(res)
      setLoading(false)
    }
    handleFetchCustomer()
  }, [id])

  return loading ? (
    ''
  ) : (
    <div className="text-white">
      <p>{localCustomer.name}</p>
      <p>{localCustomer.points}</p>
      <p>{localCustomer.email}</p>
      <p>{localCustomer.contact_number}</p>
    </div>
  )
}

export default CustomersShow
