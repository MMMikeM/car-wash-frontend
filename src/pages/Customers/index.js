import React, { useState, useEffect } from 'react'
import {
  getCustomers,
  getCustomersCSV,
  deleteCustomer,
} from '../../services/customersApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { Link, useHistory } from 'react-router-dom'
import { handleDownload } from '../../helpers'
import Modal from '../Sales/modal'


const CustomersIndex = () => {
  const history = useHistory()
  let [localCustomers, setLocalCustomers] = useState([])
  let [loading, setLoading] = useState(true)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [deleteId, setDeleteId] = useState('')
  let [selectedCustomer, setSelectedCustomer] = useState({})


  const handleFetchCustomers = async () => {
    let res = await getCustomers()
    setLocalCustomers(res)
    setLoading(false)
  }

  const handleDownloadCustomers = async () => {
    let res = await getCustomersCSV()
    handleDownload(res, 'CustomerList')
  }

  useEffect(() => {
    handleFetchCustomers()
  }, [])

  const addVehicle = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/vehicles/new`)
  }

  const handleDeleteCustomer = async (elementId) => {
    console.log(elementId)
    setSelectedCustomer(localCustomers.find((x) => x.id === elementId))
    setModalIsVisible(true)
    setDeleteId(elementId)
  }

  let addWash = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/washes/new`)
  }


  const handleSubmit = async () => {
    setLoading(!loading)
    await deleteCustomer(deleteId)
    handleFetchCustomers()
    setModalIsVisible(false)
    history.go(0)
  }

  return (
    <div className="w-100">
      {!loading ? (

        <div className="w-100">
          <Modal
            selectedCustomer={selectedCustomer}
            onClick={handleSubmit}
            visible={modalIsVisible}
            hideModal={() => setModalIsVisible(false)}
          />
          <div className="row">
            <div className="col-md-9"></div>
            <div className="col-md-3 text-right">
              <Link
                className="btn btn-primary mb-2 px-4 py-2 w-100"
                to="/customers/new"
              >
                Add customer
              </Link>
            </div>
            <div className="col-md-12">
              <BasicTable
                rowType={'customers'}
                records={localCustomers}
                fields={[
                  'name',
                  'email',
                  'contact_number',
                  'vehicles/registration_number',
                ]}
                headings={[
                  'name',
                  'email',
                  'contact_number',
                  'vehicles/registration_number',
                ]}
                crudEnabled={true}
                deleteMethod={handleDeleteCustomer}
                extraButtons={[
                  <button
                    className="link-primary btn btn-link py-0 border-0 d-block button-to-link"
                    onClick={(e) => addVehicle(e)}
                  >
                    Add Vehicle
                  </button>,
                  <button
                    className="link-primary btn btn-link py-0 border-0 d-block button-to-link"
                    onClick={(e) => addWash(e)}
                  >
                    Add Wash
                  </button>,
                ]}
              />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-9"></div>
            <div className="col-md-3 text-right">
              <button
                className="btn btn-primary mb-2 px-4 py-2 w-100"
                onClick={handleDownloadCustomers}
              >
                Download Customer List
              </button>
            </div>
          </div>
        </div>
      ) : (
          ''
        )}
    </div>
  )
}

export default CustomersIndex
