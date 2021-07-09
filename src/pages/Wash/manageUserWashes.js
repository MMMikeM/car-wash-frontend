import React, { useState, useEffect } from 'react'
import { postWash, deleteWash } from '../../services/washesApi'
import { getWashes } from '../../services/washTypesApi'
import { getCustomer } from '../../services/customersApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory, useParams } from 'react-router-dom'
import Modal from '../../components/Modals/Modal'
import { FaUser, FaCar, FaCoins, FaMobileAlt, FaEnvelope } from 'react-icons/fa'

const ManageUserWashes = () => {
  const history = useHistory()
  let { id } = useParams()
  let [data, setData] = useState({ user_id: id, wash_type_id: '' })
  let [localCustomer, setLocalCustomer] = useState({})
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)
  let [submitted, setSubmitted] = useState(false)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [selectedWashId, setSelectedWashId] = useState('')
  let [fogging, setFogging] = useState(false)
  let [hasInsurance, setHasInsurance] = useState(false)

  const freeWashPoints = -washes?.filter((wash) => wash.free == true)[0]?.points
  let qualifies = localCustomer.total_points >= freeWashPoints

  // const save = async (body) => {
  //   // eslint-disable-next-line
  //   let res = await postWash(data)
  //   history.push('/')
  // }

  useEffect(() => {
    const handleFetchData = async () => {
      let resCustomer = await getCustomer(id)
      let resWashes = await getWashes()
      setLocalCustomer(resCustomer)
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

  const washCard = ({ name, price, points, id }, key, isWashSelected) => {
    let cardClass =
      'text-white bg-3 d-flex justify-content-center align-items-center m-2 p-2'
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
        <h5 className="py-0 my-0">{name}</h5>
      </div>
    )
  }
  const InsuranceCard = () => {
    let cardClass =
      'text-white bg-3 d-flex justify-content-center align-items-center m-2 p-2'
    if (hasInsurance) {
      cardClass += ' highlighted'
    }
    const handleClick = () => {
      setHasInsurance(!hasInsurance)
    }
    return (
      <div className={cardClass} key={id} onClick={handleClick}>
        <h5 className="py-0 my-0">Wash Insurance</h5>
      </div>
    )
  }

  let handleProceed = (input) => {
    setModalIsVisible(true)
  }

  const handleSubmit = async () => {
    if (submitted === false) {
      setSubmitted(true)
      let res = await postWash({
        user_id: id,
        wash_type_id: selectedWashId,
        insurance: hasInsurance,
      })
      setModalIsVisible(false)
      let resCustomer = await getCustomer(id)
      setLocalCustomer(resCustomer)
      setSelectedWashId('')
      history.push(`/customers/${id}`)
    }
  }

  let registration_list = []

  if (localCustomer.vehicles) {
    let unique_registrations = [
      ...new Set(
        localCustomer.vehicles.map((x) => x.registration_number.toUpperCase())
      ),
    ]
    registration_list = unique_registrations.map((vehicle, index) => {
      if (index > 0 && vehicle) {
        return `, ${vehicle}`
      } else {
        return vehicle
      }
    })
  }

  return (
    <div className="w-100">
      <Modal
        wash={washes.filter((wash) => wash.id == selectedWashId)[0]}
        user={localCustomer}
        onClick={handleSubmit}
        visible={modalIsVisible}
        hideModal={() => setModalIsVisible(false)}
      />

      <div className=" py-3 mb-3 bg-3 text-8">
        <h2 className="px-4 pb-3 w-100 border-bottom border-primary text-white">
          User Profile
        </h2>
        <div className="px-4 pt-2">
          <p>
            <FaUser className="mr-2 mb-1 " />
            Name:{' '}
            <span className=" ml-1 mt-1 font-weight-black">
              {localCustomer.name}
            </span>
          </p>
          <p>
            <FaCar className="mr-2 mb-1 " />
            Registration number:{' '}
            <span className=" ml-1 mt-1 font-weight-black">
              {registration_list}
            </span>
          </p>
          <p>
            <FaCoins className="mr-2 mb-1 " />
            Total Points:{' '}
            <span className=" ml-1 mt-1 font-weight-black">
              {localCustomer.total_points}
            </span>
          </p>
          <p>
            <FaMobileAlt className="mr-2 mb-1 " />
            Contact Number:{' '}
            <span className=" ml-1 mt-1 font-weight-black">
              {localCustomer.contact_number}
            </span>
          </p>
        </div>
      </div>

      <div className="wash-grid">
        {!qualifies
          ? washes
              .filter((wash) => wash.free === false)
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((wash, key) => {
                let isWashSelected = wash.id === selectedWashId
                return washCard(wash, key, isWashSelected)
              })
          : washes
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .sort((washa, washb) => Number(washa.free < washb.free))
              .map((wash, key) => {
                let isWashSelected = wash.id === selectedWashId
                return washCard(wash, key, isWashSelected)
              })}
        <InsuranceCard />

        {selectedWashId != '' ? (
          <div
            onClick={handleProceed}
            className="text-black bg-primary d-flex justify-content-center align-items-center m-2 p-2 font-weight-bold"
          >
            <h5 className="py-0 my-0">
              {!submitted ? 'Proceed' : 'Processing...'}
            </h5>
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
      )}
    </div>
  )
}

export default ManageUserWashes
