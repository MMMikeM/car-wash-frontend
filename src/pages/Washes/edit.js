import React, { useState, useEffect } from 'react'
import { getWash, saveWash } from '../../services/washTypesApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import { useParams, useHistory } from 'react-router-dom'

const WashEdit = () => {
  let [localWash, setLocalWash] = useState({})
  let [loading, setLoading] = useState(true)

  const history = useHistory()
  let { id } = useParams()

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setLocalWash(tempRecord)
  }

  const save = async () => {
    let res = await saveWash(localWash.id, localWash)
    history.push('/')
  }

  useEffect(() => {
    const handleFetchWash = async () => {
      let res = await getWash(id)
      setLocalWash(res)
      setLoading(false)
    }
    handleFetchWash()
  }, [id])

  return (
    <div>
      {!loading ? (
        <BasicForm
          editRecordMethod={editRecordMethod}
          record={localWash}
          saveFormData={save}
          editableKeys={['name', 'cost', 'price', 'points', 'description']}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default WashEdit
