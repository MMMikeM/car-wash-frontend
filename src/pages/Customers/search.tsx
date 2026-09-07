import React, { useState } from 'react'
import { searchCustomer, deleteCustomer } from '../../services/customersApi'
import BasicTable, { CrudActions } from '../../components/Tables/BasicTable'
import { Link, useHistory } from 'react-router-dom'
import Modal from '../Sales/modal'
import type { Customer } from '../../types'
import { Button } from '@/components/ui/button'

const CustomersSearch = () => {
  let [searchTerm, setSearchTerm] = useState('')
  let [selectValue, setSelectValue] = useState('name')
  let [localCustomers, setLocalCustomers] = useState<Customer[]>([])
  let [isLoaded, setIsLoaded] = useState(false)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [deleteId, setDeleteId] = useState('')
  let [loading, setLoading] = useState(true)
  let [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer>>({})
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

  let addWash = (customer) => {
    history.push(`/customers/${customer.id}/washes/new`)
  }

  const addVehicle = (customer) => {
    history.push(`/customers/${customer.id}/vehicles/new`)
  }

  const handleSubmit = async () => {
    setLoading(!loading)
    await deleteCustomer(deleteId)
    search(selectValue, searchTerm, page)
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
      <div className="w-full px-3">
        <Modal
          selectedCustomer={selectedCustomer}
          onClick={handleSubmit}
          visible={modalIsVisible}
          hideModal={() => setModalIsVisible(false)}
        />
        <div className="flex justify-center max-sm mx-auto flex-col">
          <div className="flex flex-col w-full">
            <label className="text-6">Search by field</label>
            <form
              className="text-9 flex flex-col"
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <label className="mt-2" htmlFor="iR1">
                <input
                  className="mr-2 h-5 w-5 accent-primary align-top"
                  type="radio"
                  name="inlineRadioOptions"
                  id="iR1"
                  value="name"
                  checked={selectValue == 'name'}
                />
                Name
              </label>

              <label className="mt-2" htmlFor="iR2">
                <input
                  className="mr-2 h-5 w-5 accent-primary align-top"
                  type="radio"
                  name="inlineRadioOptions"
                  id="iR2"
                  value="registration_number"
                />
                Registration Number
              </label>

              <label className="mt-2" htmlFor="iR3">
                <input
                  className="mr-2 h-5 w-5 accent-primary align-top"
                  type="radio"
                  name="inlineRadioOptions"
                  id="iR3"
                  value="email"
                />
                Email
              </label>

              <label className="mt-2" htmlFor="iR4">
                <input
                  className="mr-2 h-5 w-5 accent-primary align-top"
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
              className="block w-full px-3 py-1.5 leading-normal bg-2 border-0 text-6 mb-3 my-4 border-bottom rounded-0 border-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
            <div className="flex justify-center mt-2">
              <Button
                className="px-5 mx-auto"
                onClick={() => {
                  setPage(0)
                  search(selectValue, searchTerm, 0)
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-5">
          {isLoaded ? (
            <>
              {localCustomers.length === 0 ? (
                <div className="text-center">
                  <p className="text-white">No customers found</p>
                  <Button asChild className="py-2 px-4">
                    <Link to="/customers/new">Add customer</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <BasicTable
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
                    renderActions={(customer) => (
                      <>
                        <Button
                          variant="link"
                          onClick={() => addVehicle(customer)}
                        >
                          Add Vehicle
                        </Button>
                        <Button variant="link" onClick={() => addWash(customer)}>
                          Add Wash
                        </Button>
                        <CrudActions
                          rowType="customers"
                          record={customer}
                          onDelete={handleDeleteCustomer}
                        />
                      </>
                    )}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <Button variant="secondary"
           
           onClick={handlePrevPage}
           disabled={page === 0}
          >
                      Previous
                    </Button>
                    <span className="text-white">
                      Page {page + 1} of {totalPages || 1} ({total} total)
                    </span>
                    <Button variant="secondary"
           
           onClick={handleNextPage}
           disabled={page >= totalPages - 1}
          >
                      Next
                    </Button>
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
