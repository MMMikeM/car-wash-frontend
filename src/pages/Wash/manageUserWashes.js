import React, { useState, useEffect } from 'react'
import { postWash, deleteWash } from '../../services/washesApi'
import { getWashes } from '../../services/washTypesApi'
import { getCustomer } from '../../services/customersApi.js'
import BasicForm from '../../components/Forms/BasicForm'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory, useParams } from 'react-router-dom'
import Modal from '../../components/Modals/Modal'

const ManageUserWashes = () => {
  const history = useHistory()
  let { id } = useParams()
  let [data, setData] = useState({ user_id: id, wash_type_id: '' })
  let [localCustomer, setLocalCustomer] = useState({})
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [selectedWashId, setSelectedWashId] = useState('')
  let [fogging, setFogging] = useState(false)

  const save = async (body) => {
    // eslint-disable-next-line
    let res = await postWash(data)
    history.push('/')
  }

  useEffect(() => {
    const handleFetchData = async () => {
      let resCustomer = await getCustomer(id)
      let resWashes = await getWashes()
      setLocalCustomer(resCustomer)
      setWashes(resWashes)
      setSelectedWashId(resWashes[0].id)
      setLoading(false)
    }
    handleFetchData()
  }, [id])

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setData(tempRecord)
  }


  const washCard = ({ name, price, points, id }, key, isWashSelected) => {
    console.log(name, price, points, key, isWashSelected)
    let cardClass =
      'text-white bg-1 d-flex justify-content-center align-items-center m-2 p-2'
    if (isWashSelected) {
      cardClass += ' highlighted'
    }
    return (
      <div
        className={cardClass}
        key={id}
        onClick={() => {
          if (selectedWashId === id) {
            setSelectedWashId('')
          } else {
            setSelectedWashId(id)
          }
        }}
      >
        <p className="py-0 my-0">{name}</p>
      </div>
    )
  }

  let handleProceed = (input) => {
    setModalIsVisible(true)
  }

  const handleSubmit = async () => {
    let res = await postWash({ user_id: id, wash_type_id: selectedWashId })
    setModalIsVisible(false)
    let resCustomer = await getCustomer(id)
    setLocalCustomer(resCustomer)
    setSelectedWashId('')
    history.push(`/customers/${id}`)
  }

  return (
    <div>
      <Modal
        title={washes.filter((wash) => wash.id == selectedWashId)[0]?.name}
        description={`Are you sure you want to add this wash to this user?`}
        onClick={handleSubmit}
        visible={modalIsVisible}
        hideModal={() => setModalIsVisible(false)}
      />
      <h2 className="text-white">{localCustomer.name}</h2>

      <div className="wash-grid">
        {washes?.map((wash, key) => {
          let isWashSelected = wash.id === selectedWashId
          return washCard(wash, key, isWashSelected)
        })}
        <div
          onClick={handleProceed}
          className="text-black bg-primary d-flex justify-content-center align-items-center m-2 p-2 font-weight-bold"
        >
          <p className="py-0 my-0">Proceed</p>
        </div>
      </div>
      {!loading ? (
        <BasicTable
          rowType={'washes'}
          records={localCustomer.washes}
          fields={['wash_type', 'created_at']}
          headings={['wash_type', 'created_at']}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default ManageUserWashes
