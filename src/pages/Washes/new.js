import React, { useState } from 'react'
import { postWash } from '../../services/washTypesApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import { useHistory } from 'react-router-dom'

const WashNew = () => {
  let [newWash, setNewWash] = useState({
    name: '',
    cost: '',
    price: '',
    points: '',
    description: '',
  })

  let [loading, setLoading] = useState(false)

  const history = useHistory()

  const save = async () => {
    setLoading(true)
    let res = await postWash(newWash)
    setLoading(false)
    history.push('/')
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setNewWash(tempRecord)
  }

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <BasicForm
          editRecordMethod={editRecordMethod}
          record={newWash}
          saveFormData={save}
          editableKeys={['name', 'cost', 'price', 'points', 'description']}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default WashNew
