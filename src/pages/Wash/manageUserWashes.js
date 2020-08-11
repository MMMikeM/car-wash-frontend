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
    let cardClass =
      'text-white bg-1 d-flex justify-content-center align-items-center m-2 p-2'
    if (isWashSelected) {
      cardClass += ' highlighted'
    }
    const handleClick = () => {
      if (selectedWashId === id && !loading) {
        setSelectedWashId('')
      } else {
        setSelectedWashId(id)
      }
    }
    return (
      <div className={cardClass} key={id} onClick={handleClick}>
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
    <div className="w-100">
      <Modal
        title={washes.filter((wash) => wash.id == selectedWashId)[0]?.name}
        description={`Are you sure you want to add this wash to this user?`}
        onClick={handleSubmit}
        visible={modalIsVisible}
        hideModal={() => setModalIsVisible(false)}
      />
      <h3 className="text-white ml-3 pb-2">User: {localCustomer.name}</h3>

      <div className="wash-grid">
        {washes?.map((wash, key) => {
          let isWashSelected = wash.id === selectedWashId
          return washCard(wash, key, isWashSelected)
        })}
        {selectedWashId != '' ? (
          <div
            onClick={handleProceed}
            className="text-black bg-primary d-flex justify-content-center align-items-center m-2 p-2 font-weight-bold"
          >
            <p className="py-0 my-0">Proceed</p>
          </div>
        ) : (
          ''
        )}
      </div>
      {!loading && localCustomer.washes.length > 0 ? (
        <div className="max-md mx-auto">
          <BasicTable
            rowType={'washes'}
            records={localCustomer.washes}
            fields={['wash_type', 'created_at']}
            headings={['wash_type', 'created_at']}
          />
        </div>
      ) : (
        ''
        // <div className="d-flex justify-content-center mt-3 text-white">
        //   <h2>No saved washes</h2>
        // </div>
      )}
    </div>
  )
}

export default ManageUserWashes
