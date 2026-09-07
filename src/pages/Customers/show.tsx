import React, { useState, useEffect } from 'react'
import { getCustomer } from '../../services/customersApi'
import { getWashes } from '../../services/washTypesApi'
import { Link, useParams, useHistory } from 'react-router-dom'
import BasicTable from '../../components/Tables/BasicTable'
import { FaUser, FaCar, FaCoins, FaMobileAlt, FaEnvelope } from 'react-icons/fa'
import { deleteWash } from '../../services/washesApi'
import Modal from './modal'
import dayjs from 'dayjs'
import type { Customer, WashType } from '../../types'
import { Button } from '@/components/ui/button'


const CustomersShow = () => {
  let [localCustomer, setLocalCustomer] = useState<Partial<Customer>>({})
  let [washes, setWashes] = useState<WashType[]>([])
  let [loading, setLoading] = useState(true)
  let [processed, setProcessed] = useState(false)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [selectedWash, setSelectedWash] = useState('')

  const history = useHistory()
  let { id } = useParams()

  const handleFetchCustomer = async () => {
    let resCustomer = await getCustomer(id)
    let resWashes = await getWashes()
    setLocalCustomer(resCustomer)
    setWashes(resWashes)
    setLoading(false)
  }
  useEffect(() => {
    handleFetchCustomer()
  }, [id])

  const handleClick = async (e) => {
    setSelectedWash(e.currentTarget.parentNode.id)
    setModalIsVisible(true)
  }

  const handleSubmit = async () => {
    let res = await deleteWash(selectedWash)
    setModalIsVisible(false)
    history.go(0)
  }

  if (!loading && localCustomer?.washes[0]?.wash_type_id && !processed) {
    setProcessed(true)
    let tempWashes = []
    localCustomer.washes?.map((item) => {
      let tempObject = item
      let date = new Date(item.created_at)
      tempObject.wash = washes.filter(
        (wash) => item.wash_type_id === wash.id
      )[0]?.name
      
      tempObject.created_at = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      // console.log(tempObject.created_at)
        // date.toLocaleDateString() + ' - ' + date.toLocaleTimeString()
      tempWashes.push(tempObject)
    })
    let tempCustomer = localCustomer
    tempCustomer.washes = tempWashes
    setLocalCustomer(tempCustomer)
  }

  let regex = /[\d|a-f]{8}\b-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{4}-\b[\d|a-f]{12}\b@carboncarwash.co.za/g
  let email = localCustomer?.email
  if (regex.test(email)) {
    email = 'No email provided'
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

  let roles = JSON.parse(sessionStorage.getItem('roles'))
  console.log(roles)

  return loading ? (
    ''
  ) : (
    <div>
      <Modal
        id={selectedWash}
        user={localCustomer}
        onClick={handleSubmit}
        visible={modalIsVisible}
        hideModal={() => setModalIsVisible(false)}
      />

      <div className="text-8 flex justify-content-center flex-column max-sm bg-3 px-4 pt-4 pb-3 rounded">
        <div className="row px-2 pt-2">
          <p>
            <FaUser className="mr-2 mb-1 text-white" />
            Name:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.name}
            </span>
          </p>
          <p>
            <FaEnvelope className="mr-2 mb-1 text-white" />
            Email:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {email}
            </span>
          </p>
          <p>
            <FaMobileAlt className="mr-2 mb-1 text-white" />
            Contact number:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.contact_number}
            </span>
          </p>
          <p>
            <FaCoins className="mr-2 mb-1 text-white" />
            Total Points:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.total_points}
            </span>
          </p>
          <p>
            <FaCar className="mr-2 mb-1 text-white" />
            Registration:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {registration_list}
            </span>
          </p>
        </div>
        <div className="flex justify-content-between mt-2">
          <Button asChild className="mb-2 mr-2">
            <Link to={`/${localCustomer.id}/password_reset`}>Reset password</Link>
          </Button>
          <Button asChild className="mb-2">
            <Link to={`/customers/${localCustomer.id}/washes/new`}>Add wash</Link>
          </Button>
        </div>
      </div>
      {localCustomer?.washes.length > 0 ? (
        <div className="mt-4">
          <BasicTable
            rowType={'washes'}
            records={localCustomer.washes}
            fields={['wash', 'created_at']}
            headings={['Wash Type', 'created_at']}
            extraButtons={[
              roles.includes('manager') ? (
                <Button variant="link"
                  className="link-primary py-0 border-0 d-block button-to-link"
                  onClick={(e) => handleClick(e)}
                >
                  Delete Wash
                </Button>
              ) : (
                ''
              ),
            ]}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default CustomersShow
