import React, { useState, useEffect } from 'react'
import BasicCard from '../../components/BasicCard'
import { getWashes } from '../../services/washTypesApi'

const Washes = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)
  useEffect(() => {
    handleFetchWashes()
  }, [])

  const handleFetchWashes = async () => {
    let res = await getWashes()
    setWashes(res)
    setLoading(false)
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-center flex-gap flex-wrap">
        <img
          alt="Company logo"
          src="/logo.png"
          style={{ width: '200px' }}
          className="mx-auto mb-5"
        />
      </div>

      <div className="d-flex flex-row justify-content-center flex-gap flex-wrap">
        {!loading ? <BasicCard data={washes} /> : ''}
      </div>
    </>
  )
}

export default Washes
