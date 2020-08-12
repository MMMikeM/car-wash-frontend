import React, { useState, useEffect } from 'react'
import { getWash, saveWash } from '../../services/washTypesApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import { useParams, useHistory } from 'react-router-dom'
import { centsToRands } from '../../helpers'

const WashFreeEdit = () => {
  let [localWash, setLocalWash] = useState({})
  let [loading, setLoading] = useState(true)

  const history = useHistory()
  let { id } = useParams()

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    if (['price', 'cost'].includes(key)) {
      tempRecord[key] = value * 100
    } else {
      tempRecord[key] = value
    }
    setLocalWash(tempRecord)
  }

  const save = async () => {
    // eslint-disable-next-line no-unused-vars
    let res = await saveWash(localWash.id, localWash)
    history.push(`/wash_types/${id}`)
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
    <div className="w-100">
      <div className="max-sm mx-auto bg-3 p-5 rounded">
        {!loading ? (
          <BasicForm
            editRecordMethod={editRecordMethod}
            record={localWash}
            saveFormData={save}
            editableKeys={['name', 'cost', 'points', 'description']}
            valueTransformations={['', centsToRands, '', '']}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default WashFreeEdit
