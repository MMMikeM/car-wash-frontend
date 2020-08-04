import React, { useState, useEffect } from 'react'
import { getWash, saveWash } from '../../services/washTypesApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import { useParams, useHistory, Link } from 'react-router-dom'

const WashShow = () => {
  let [localWash, setLocalWash] = useState({})
  let [loading, setLoading] = useState(true)

  const history = useHistory()
  let { id } = useParams()

  useEffect(() => {
    const handleFetchWash = async () => {
      let res = await getWash(id)
      setLocalWash(res)
      setLoading(false)
    }
    handleFetchWash()
  }, [id])

  return loading ? "" :(
    <div className="text-white">
      <p>Name: {localWash.name}</p>
      <p>Description: {localWash.description}</p>
      <p>Cost: {localWash.cost}</p>
      <p>Selling Price: {localWash.price}</p>
      <p>Points awarded: {localWash.points}</p>
      <Link className="btn btn-primary" to='/wash_types'>Back to washes</Link>
    </div>
  )
}

export default WashShow
