import React, { useState, useEffect } from 'react'
import {
  getCustomers,
  getCustomersCSV,
  deleteCustomer,
} from '../../services/customersApi'
import { Link, useHistory } from 'react-router-dom'
import { handleDownload } from '../../helpers'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const formatEmail = (email) => {
  const regex = /[\d|a-f]{8}\b-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{4}-\b[\d|a-f]{12}\b@carboncarwash.co.za/g
  if (regex.test(email)) {
    return null
  }
  return email
}

const getVehicleRegs = (vehicles) => {
  if (!vehicles || vehicles.length === 0) return null
  if (vehicles.length > 2) return 'Multiple'
  return vehicles
    .map((v) => v.registration_number)
    .filter(Boolean)
    .join(', ')
    .toUpperCase()
}

const CustomerCard = ({ customer, onAddWash, history }) => {
  const email = formatEmail(customer.email)
  const vehicles = getVehicleRegs(customer.vehicles)

  const handleCardClick = (e) => {
    // Don't navigate if clicking the Wash button
    if (e.target.closest('button')) return
    history.push(`/customers/${customer.id}`)
  }

  return (
    <div
      className="bg-card mb-2 flex flex-col gap-1 rounded-lg px-4 py-3 cursor-pointer active:bg-muted/50"
      onClick={handleCardClick}
    >
      <h3 className="font-semibold text-foreground leading-tight">
        {customer.name}
      </h3>

      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {email && (
            <span className="text-sm break-words text-muted-foreground">
              {email}
            </span>
          )}
          {customer.contact_number && (
            <span className="text-sm text-muted-foreground">
              {customer.contact_number}
            </span>
          )}
          {vehicles && (
            <span className="font-mono text-xs break-words text-muted-foreground">
              {vehicles}
            </span>
          )}
        </div>

        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onAddWash(customer.id)
          }}
        >
          Add wash
        </Button>
      </div>
    </div>
  )
}

const CustomerTableRow = ({ customer, onAddWash, history }) => {
  const email = formatEmail(customer.email)
  const vehicles = getVehicleRegs(customer.vehicles)

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => history.push(`/customers/${customer.id}`)}
    >
      <TableCell className="font-medium">{customer.name}</TableCell>
      <TableCell className="text-muted-foreground">{email || '—'}</TableCell>
      <TableCell>{customer.contact_number || '—'}</TableCell>
      <TableCell className="font-mono text-xs">{vehicles || '—'}</TableCell>
      <TableCell>
        <Button
          size="xs"
          onClick={(e) => {
            e.stopPropagation()
            onAddWash(customer.id)
          }}
        >
          Add wash
        </Button>
      </TableCell>
    </TableRow>
  )
}

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

  const handleAddVehicle = (customerId) => {
    history.push(`/customers/${customerId}/vehicles/new`)
  }

  const handleAddWash = (customerId) => {
    history.push(`/customers/${customerId}/washes/new`)
  }

  const handleDeleteCustomer = async (elementId) => {
    setSelectedCustomer(localCustomers.find((x) => x.id === elementId))
    setModalIsVisible(true)
    setDeleteId(elementId)
  }

  const handleSubmit = async () => {
    setLoading(!loading)
    await deleteCustomer(deleteId)
    handleFetchCustomers()
    setModalIsVisible(false)
    history.go(0)
  }

  const reversedCustomers = [...localCustomers].reverse()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ConfirmDialog
        open={modalIsVisible}
        onOpenChange={setModalIsVisible}
        onConfirm={handleSubmit}
        title="Delete customer"
        description={`Are you sure you would like to delete ${selectedCustomer?.name ?? 'this customer'}?`}
        confirmLabel="Delete"
        destructive
      />

      <Link to="/customers/new" className="block mb-4">
        <Button className="w-full">Add customer</Button>
      </Link>

      {/* Mobile: Card Layout */}
      <div className="md:hidden">
        {reversedCustomers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No customers yet. Add your first one!
            </CardContent>
          </Card>
        ) : (
          reversedCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onAddWash={handleAddWash}
              history={history}
            />
          ))
        )}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reversedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No customers yet. Add your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  reversedCustomers.map((customer) => (
                    <CustomerTableRow
                      key={customer.id}
                      customer={customer}
                      onAddWash={handleAddWash}
                      history={history}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pagination - only show when multiple pages */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevPage}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      <button
        className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground py-2"
        onClick={handleDownloadCustomers}
      >
        Download CSV
      </button>
    </div>
  )
}

export default CustomersIndex
