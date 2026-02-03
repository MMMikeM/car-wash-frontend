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
import { Button } from '@/components/ui/button'


const CustomersIndex = () => {
  const history = useHistory()
  let [localCustomers, setLocalCustomers] = useState([])
  let [loading, setLoading] = useState(true)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [deleteId, setDeleteId] = useState('')
  let [selectedCustomer, setSelectedCustomer] = useState({})
  let [page, setPage] = useState(0)
  let [perPage] = useState(20)
  let [total, setTotal] = useState(0)

  const handleFetchCustomers = async (pageNum = page) => {
    setLoading(true)
    let res = await getCustomers(pageNum, perPage)
    setLocalCustomers(res.data)
    setTotal(res.total)
    setLoading(false)
  }

  const handleDownloadCustomers = async () => {
    let res = await getCustomersCSV()
    handleDownload(res, 'CustomerList')
  }

  useEffect(() => {
    handleFetchCustomers(page)
  }, [page])

  const totalPages = Math.ceil(total / perPage)

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1)
  }

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
              <Link to="/customers/new" className="w-full mb-2 block">
                <Button className="w-full">Add customer</Button>
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
          <div className="row mt-3">
            <div className="col-md-12 d-flex justify-content-between align-items-center">
              <Button
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-white">
                Page {page + 1} of {totalPages} ({total} total)
              </span>
              <Button
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-9"></div>
            <div className="col-md-3 text-right">
              <Button
                className="w-full mb-2"
                onClick={handleDownloadCustomers}
              >
                Download Customer List
              </Button>
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
