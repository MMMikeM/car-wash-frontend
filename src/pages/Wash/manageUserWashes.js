import React, { useState, useEffect } from 'react'
import { postWash, deleteWash } from '../../services/washesApi'
import { getWashes } from '../../services/washTypesApi'
import { getCustomer } from '../../services/customersApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory, useParams } from 'react-router-dom'

const ManageUserWashes = () => {
  const history = useHistory()
  let { id } = useParams()
  let [data, setData] = useState({ user_id: id, wash_type_id: '' })
  let [localCustomer, setLocalCustomer] = useState({})
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)

  const save = async (body) => {
    // eslint-disable-next-line
    let res = await postWash(data)
    history.push('/')
  }

  useEffect(() => {
    // const handleFetchCustomer = async () => {
    const handleFetchData = async () => {
      let resCustomer = await getCustomer(id)
      setLocalCustomer(resCustomer)
      let resWashes = await getWashes()
      setWashes(resWashes)
      setLoading(false)
    }
    handleFetchData()
  }, [id])

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setData(tempRecord)
  }

  console.log(washes)
  console.log(localCustomer)

  const washCard = (name, price, points, id, key) => {
    return (
      <div className="text-white flex flex-column bg-1 mt-3 p-4">
        <p className="py-0 my-0">Name: {name}</p>
        <p className="py-0 my-0">Price: {price}</p>
        <p className="py-0 my-0">Points: {points}</p>
        <p className="py-0 my-0">id: {id}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-white">{localCustomer.name}</h2>

      {!loading ? (
        <div className="flex flex-row flex-wrap">
          {washes.map((wash, key) =>
            washCard(wash.name, wash.price, wash.points, wash.id, key)
          )}
          )
        </div>
      ) : (
        ''
      )}
      <BasicForm
        editRecordMethod={editRecordMethod}
        record={data}
        saveFormData={save}
        editableKeys={['wash_type_id']}
      />

      {!loading ? (
        <BasicTable
          rowType={'washes'}
          records={localCustomer.washes}
          headings={['wash_type', 'created_at']}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default ManageUserWashes
