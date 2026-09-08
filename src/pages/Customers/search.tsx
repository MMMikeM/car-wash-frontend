import React, { useState } from 'react'
import { searchCustomer, deleteCustomer } from '../../services/customersApi'
import BasicTable, { CrudActions } from '../../components/Tables/BasicTable'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import type { Customer } from '../../types'
import { Button } from '@/components/ui/button'
import { reportError } from '@/lib/reportError'
import { toast } from '@/components/ui/toast'

const SEARCH_FIELDS = [
  { value: 'name', label: 'Name' },
  { value: 'registration_number', label: 'Registration Number' },
  { value: 'email', label: 'Email' },
  { value: 'contact_number', label: 'Contact Number' },
] as const

const CustomersSearch = () => {
  let [searchTerm, setSearchTerm] = useState('')
  let [selectValue, setSelectValue] = useState('name')
  let [localCustomers, setLocalCustomers] = useState<Customer[]>([])
  let [isLoaded, setIsLoaded] = useState(false)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [deleteId, setDeleteId] = useState('')
  let [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer>>({})
  let [page, setPage] = useState(0)
  let [perPage] = useState(20)
  let [total, setTotal] = useState(0)

  const navigate = useNavigate()

  const totalPages = Math.ceil(total / perPage)

  const search = async (term, value, pageNum = 0) => {
    try {
      let res = await searchCustomer(term, value, pageNum, perPage)
      setLocalCustomers(res.data)
      setTotal(res.total)
    } catch (error) {
      reportError(error, 'search customers')
    } finally {
      setIsLoaded(true)
    }
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
    navigate(`/customers/${customer.id}/washes/new`)
  }

  const addVehicle = (customer) => {
    navigate(`/customers/${customer.id}/vehicles/new`)
  }

  const handleSubmit = async () => {
    setModalIsVisible(false)
    try {
      await deleteCustomer(deleteId)
    } catch (error) {
      reportError(error, 'delete the customer')
      return
    }
    toast.success('Customer deleted')
    search(selectValue, searchTerm, page)
  }

  const handleDeleteCustomer = async (elementId) => {
    setSelectedCustomer(localCustomers.find((x) => x.id === elementId))
    setModalIsVisible(true)
    setDeleteId(elementId)
  }

  return (
    <React.Fragment>
      <div className="w-full px-3">
        <ConfirmDialog
          open={modalIsVisible}
          onOpenChange={setModalIsVisible}
          onConfirm={handleSubmit}
          title="Delete customer"
          description={`Are you sure you would like to delete ${
            selectedCustomer?.name ?? 'this customer'
          }?`}
          confirmLabel="Delete"
          destructive
        />
        <div className="flex justify-center max-sm mx-auto flex-col">
          <div className="flex flex-col w-full">
            <fieldset className="flex flex-col">
              <legend className="text-6">Search by field</legend>
              {SEARCH_FIELDS.map(({ value, label }) => (
                <label className="mt-2" key={value} htmlFor={`search-by-${value}`}>
                  <input
                    className="mr-2 h-5 w-5 accent-primary align-top"
                    type="radio"
                    name="searchField"
                    id={`search-by-${value}`}
                    value={value}
                    checked={selectValue === value}
                    onChange={(e) => setSelectValue(e.target.value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <input
              aria-label="Search term"
              placeholder="Search here..."
              className="block w-full px-3 py-1.5 leading-normal bg-2 border-0 text-6 mb-3 my-4 border-b rounded-none border-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <Button
                    className="py-2 px-4"
                    render={
                      <Link
                        to="/customers/new"
                        className="text-primary-foreground! no-underline!"
                      />
                    }
                  >
                    Add customer
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
