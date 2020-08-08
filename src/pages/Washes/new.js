import React, { useState } from 'react'
import { postWash } from '../../services/washTypesApi.js'
import { WashForm, schema } from './form'
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
    let valid = await schema.validate(newWash).catch((err) => {alert(err.errors)})
    if (valid){ 

    setLoading(true)
    // eslint-disable-next-line no-unused-vars
    let res = await postWash(newWash)
    setLoading(false)
    history.push(`/wash_types/${res.id}`)}
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    if (['price', 'cost'].includes(key)) {
      tempRecord[key] = (value * 100)
    } else {
      tempRecord[key] = value
    }
    setNewWash(tempRecord)
  }

  return (
    <div className="w-50 mx-auto d-flex flex-column">
      {!loading ? (
        <WashForm
          editRecordMethod={editRecordMethod}
          record={newWash}
          save={save}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default WashNew
