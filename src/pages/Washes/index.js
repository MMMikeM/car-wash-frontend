import React, { useState, useEffect } from 'react'
import { getWashes } from '../../services/washTypesApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory } from 'react-router-dom'

const WashesIndex = () => {
  const history = useHistory()
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
        <BasicTable
          rowType={'wash_types'}
          records={washes}
          headings={['name', 'cost', 'price', 'points']}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default WashesIndex
