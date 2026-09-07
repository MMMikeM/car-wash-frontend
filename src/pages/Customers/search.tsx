import React, { useState } from 'react'
import { searchCustomer, deleteCustomer } from '../../services/customersApi'
import BasicTable from '../../components/Tables/BasicTable'
import { Link, useHistory } from 'react-router-dom'
import Modal from '../Sales/modal'

const CustomersSearch = () => {
  let [searchTerm, setSearchTerm] = useState('')
  let [selectValue, setSelectValue] = useState('name')
  let [localCustomers, setLocalCustomers] = useState([])
  let [isLoaded, setIsLoaded] = useState(false)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [deleteId, setDeleteId] = useState('')
  let [loading, setLoading] = useState(true)
  let [selectedCustomer, setSelectedCustomer] = useState({})
  let [page, setPage] = useState(0)
  let [perPage] = useState(20)
  let [total, setTotal] = useState(0)

  const history = useHistory()

  const totalPages = Math.ceil(total / perPage)

  const search = async (term, value, pageNum = 0) => {
    let res = await searchCustomer(term, value, pageNum, perPage)
    setLocalCustomers(res.data)
    setTotal(res.total)
    setIsLoaded(true)
  }

  const handlePrevPage = () => {
    if (page > 0) {
      const newPage = page - 1
      setPage(newPage)
      search(selectValue, searchTerm, newPage)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      const newPage = page + 1
      setPage(newPage)
      search(selectValue, searchTerm, newPage)
    }
  }

  let addWash = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/washes/new`)
  }

  let showCustomer = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}`)
  }

  const addVehicle = (e) => {
    history.push(`/customers/${e.currentTarget.parentNode.id}/vehicles/new`)
  }

  const handleSubmit = async () => {
    setLoading(!loading)
    await deleteCustomer(deleteId)
    search()
    setModalIsVisible(false)
    // history.go(0)
  }

  const handleDeleteCustomer = async (elementId) => {
    setSelectedCustomer(localCustomers.find((x) => x.id === elementId))
    setModalIsVisible(true)
    setDeleteId(elementId)
  }

  return (
    <React.Fragment>
      <div className="w-100 px-3">
        <Modal
          selectedCustomer={selectedCustomer}
          onClick={handleSubmit}
          visible={modalIsVisible}
          hideModal={() => setModalIsVisible(false)}
        />
        <div className="d-flex justify-content-center max-sm mx-auto flex-column">
          <div className="d-flex flex-column w-100">
            <label className="text-6">Search by field</label>
            <form
              className="text-9 d-flex flex-column"
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <label className="form-check-label mt-2" htmlFor="iR1">
                <input
                  className="form-check-input mr-2"
                  type="radio"
                  name="inlineRadioOptions"
                  id="iR1"
                  value="name"
                  checked={selectValue == 'name'}
                />
                Name
              </label>

              <label className="form-check-label mt-2" htmlFor="iR2">
                <input
                  className="form-check-input mr-2"
                  type="radio"
                  name="inlineRadioOptions"
                  id="iR2"
                  value="registration_number"
                />
                Registration Number
              </label>

              <label className="form-check-label mt-2" htmlFor="iR3">
                <input
                  className="form-check-input mr-2"
                  type="radio"
                  name="inlineRadioOptions"
                  id="iR3"
                  value="email"
                />
                Email
              </label>

              <label className="form-check-label mt-2" htmlFor="iR4">
                <input
                  className="form-check-input mr-2"
                  type="radio"
                  name="inlineRadioOptions"
                  id="iR4"
                  value="contact_number"
                />
                Contact Number
              </label>
            </form>
            <input
              placeholder="Search here..."
              className="form-control bg-2 border-0 text-6 mb-3 my-4 border-bottom rounded-0 border-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
            <div className="d-flex justify-content-center mt-2">
              <button
                className="btn btn-primary px-5 mx-auto"
                onClick={() => {
                  setPage(0)
                  search(selectValue, searchTerm, 0)
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5">
          {isLoaded ? (
            <>
              {localCustomers.length === 0 ? (
                <div className="text-center">
                  <p className="text-white">No customers found</p>
                  <Link
                    className="btn btn-primary py-2 px-4"
                    to="/customers/new"
                  >
                    Add customer
                  </Link>
                </div>
              ) : (
                <>
                  <BasicTable
                    rowType={'customers'}
                    records={localCustomers}
                    headings={[
                      'name',
                      'email',
                      'contact_number',
                      'vehicles/registration_number',
                    ]}
                    fields={[
                      'name',
                      'email',
                      'contact_number',
                      'vehicles/registration_number',
                    ]}
                    crudEnabled={true}
                    deleteMethod={handleDeleteCustomer}
                    extraButtons={[
                      <button
                        className="link-primary btn btn-link py-0 border-0 d-block"
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
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={handlePrevPage}
                      disabled={page === 0}
                    >
                      Previous
                    </button>
                    <span className="text-white">
                      Page {page + 1} of {totalPages || 1} ({total} total)
                    </span>
                    <button
                      className="btn btn-secondary"
                      onClick={handleNextPage}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default CustomersSearch
