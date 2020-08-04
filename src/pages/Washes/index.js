import React, { useState, useEffect } from 'react'
import { getWashes } from '../../services/washTypesApi.js'
import BasicTable from '../../components/Tables/BasicTable'
 import { Link } from 'react-router-dom'

const WashesIndex = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)

  const handleFetchCustomers = async () => {
    let res = await getWashes()
    setWashes(res)
    setLoading(false)
  }

  useEffect(() => {
    handleFetchCustomers()
  }, [])

  return (
    <div>
      {!loading ? (
        <div>
          <BasicTable
            rowType={'wash_types'}
            records={washes}
            crudEnabled={true}
            headings={['name', 'cost', 'price', 'points']}
          />
              <Link className="btn btn-primary" to='/wash_types/new'>Add Wash</Link>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default WashesIndex
