import React, { useState, useEffect } from 'react'
import { getWash, saveWash } from '../../services/washTypesApi.js'
import { useParams, Link } from 'react-router-dom'
import { centsToRands, transformCentsToRands } from '../../helpers'

const WashShow = () => {
  let [localWash, setLocalWash] = useState({})
  let [loading, setLoading] = useState(true)

  let { id } = useParams()

  useEffect(() => {
    const handleFetchWash = async () => {
      let res = await getWash(id)
      setLocalWash(res)
      setLoading(false)
    }
    handleFetchWash()
  }, [id])

  return loading ? (
    ''
  ) : (
    <div className="bg-3 px-4 py-3 w-50 text-8 max-sm rounded">
      <p>
        Name:{' '}
        <span className="text-white font-weight-black">{localWash.name}</span>
      </p>
      <p>
        Description:{' '}
        <span className="text-white font-weight-black">
          {localWash.description}
        </span>
      </p>
      <p>
        Cost:{' '}
        <span className="text-white font-weight-black">
          {transformCentsToRands(localWash.cost)}
        </span>
      </p>
      <p>
        Selling Price:{' '}
        <span className="text-white font-weight-black">
          {transformCentsToRands(localWash.price)}
        </span>
      </p>
      <p>
        Points awarded:{' '}
        <span className="text-white font-weight-black">{localWash.points}</span>
      </p>
      <div className="d-flex justify-content-end">
        <Link className="btn btn-primary" to="/wash_types">
          Back to washes
        </Link>
      </div>
    </div>
  )
}

export default WashShow
