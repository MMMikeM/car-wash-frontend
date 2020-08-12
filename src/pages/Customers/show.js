import React, { useState, useEffect } from 'react'
import { getCustomer } from '../../services/customersApi.js'
import { Link, useParams, useHistory } from 'react-router-dom'
import BasicTable from '../../components/Tables/BasicTable'
import { FaUser, FaCar, FaCoins, FaMobileAlt, FaEnvelope } from 'react-icons/fa'

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
    <div>
      <div className="text-8 d-flex justify-content-center flex-column max-sm bg-3 px-4 py-3 rounded">
        <div className="row">
          <p>
            <FaUser className="mr-2 mb-1 text-white" />
            Name:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.name}
            </span>
          </p>
          <p>
            <FaEnvelope className="mr-2 mb-1 text-white" />
            Email:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.email}
            </span>
          </p>
          <p>
            <FaMobileAlt className="mr-2 mb-1 text-white" />
            Contact number:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.contact_number}
            </span>
          </p>
          <p>
            <FaCoins className="mr-2 mb-1 text-white" />
            Total Points:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.total_points}
            </span>
          </p>
        </div>
        <div className="d-flex justify-content-end">
          <Link
            className="btn btn-primary"
            to={`/customers/${localCustomer.id}/washes/new`}
          >
            Add wash
          </Link>
        </div>
      </div>
      {localCustomer.washes.length > 0 ? (
        <div className="mt-4">
          <BasicTable
            rowType={'washes'}
            records={localCustomer.washes}
            fields={['wash_type', 'created_at']}
            headings={['wash_type', 'created_at']}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersShow
