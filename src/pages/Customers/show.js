import React, { useState, useEffect } from 'react'
import { getCustomer } from '../../services/customersApi.js'
import { Link, useParams, useHistory } from 'react-router-dom'
import BasicTable from '../../components/Tables/BasicTable'

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
      <div className="row">
        <div className="col-md-10"></div>
        <div className="col-md-2">
          <Link className="btn btn-primary" to={`/customers/${localCustomer.id}/washes/new`}>Add wash</Link> 
        </div>
      </div>
      <div className="row">
        <p>Name: {localCustomer.name}</p>
        <p>Email: {localCustomer.email}</p>
        <p>Contact number: {localCustomer.contact_number}</p>
        <p>Total Points: {localCustomer.total_points}</p>
      </div>
      {localCustomer.washes.length > 0 ?
        <div className="row">
          <BasicTable
            rowType={'washes'}
            records={localCustomer.washes}
            fields={['wash_type', 'created_at']}
            headings={['wash_type', 'created_at']}
          />
        </div> : ""
      }
    </div>
  )
}

export default CustomersShow
