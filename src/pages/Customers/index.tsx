/* The customer card carries a nested "Add wash" button, so the card itself
   cannot be a <button>; it stands in for one with role, tabIndex and a key
   handler instead.  */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import React, { useState, useEffect, useCallback } from 'react'
import { Trash2 } from 'lucide-react'
import {
  getCustomers,
  getCustomersCSV,
  deleteCustomer,
} from '../../services/customersApi'
import { Link, useHistory } from 'react-router-dom'
import { handleDownload, isAnonymousEmail } from '../../helpers'
import type { Customer } from '../../types'
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
import { reportError } from '@/lib/reportError'
import { toast } from '@/components/ui/toast'
import { RecordListSkeleton } from '../../components/Loading'

const formatEmail = (email) => (isAnonymousEmail(email) ? null : email)

const getVehicleRegs = (vehicles) => {
  if (!vehicles || vehicles.length === 0) return null
  if (vehicles.length > 2) return 'Multiple'
  return vehicles
    .map((v) => v.registration_number)
    .filter(Boolean)
    .join(', ')
    .toUpperCase()
}

const CustomerCard = ({ customer, onAddWash, onDelete, history }) => {
  const email = formatEmail(customer.email)
  const vehicles = getVehicleRegs(customer.vehicles)

  const openCustomer = () => history.push(`/customers/${customer.id}`)

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return
    openCustomer()
  }

  // The card carries a nested button, so it cannot be one itself; this is the
  // keyboard half of the role it stands in for.
  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openCustomer()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${customer.name}`}
      className="bg-card mb-2 flex flex-col gap-1 rounded-lg px-4 py-3 cursor-pointer active:bg-muted/50"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <h3 className="font-semibold text-foreground leading-tight">
        {customer.name}
      </h3>

      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {email && (
            <span className="text-sm wrap-break-word text-muted-foreground">
              {email}
            </span>
          )}
          {customer.contact_number && (
            <span className="text-sm text-muted-foreground">
              {customer.contact_number}
            </span>
          )}
          {vehicles && (
            <span className="font-mono text-xs wrap-break-word text-muted-foreground">
              {vehicles}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onAddWash(customer.id)
            }}
          >
            Add wash
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Delete ${customer.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(customer.id)
            }}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}

const CustomerTableRow = ({ customer, onAddWash, onDelete, history }) => {
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
        <div className="flex items-center gap-1">
          <Button
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              onAddWash(customer.id)
            }}
          >
            Add wash
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Delete ${customer.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(customer.id)
            }}
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

const CustomersIndex = () => {
  const history = useHistory()
  let [localCustomers, setLocalCustomers] = useState<Customer[]>([])
  let [loading, setLoading] = useState(true)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [customerToDelete, setCustomerToDelete] = useState<Customer>()
  let [page, setPage] = useState(0)
  let [perPage] = useState(20)
  let [total, setTotal] = useState(0)

  const loadCustomers = useCallback(async (pageNum: number) => {
    setLoading(true)
    try {
      let res = await getCustomers(pageNum, perPage)
      setLocalCustomers(res.data)
      setTotal(res.total)
    } catch (error) {
      reportError(error, 'load customers')
    } finally {
      setLoading(false)
    }
  }, [perPage])

  const handleDownloadCustomers = async () => {
    try {
      let res = await getCustomersCSV()
      handleDownload(res, 'CustomerList')
    } catch (error) {
      reportError(error, 'download the customer list')
    }
  }

  useEffect(() => {
    // State is set after the await, not synchronously.
    // oxlint-disable-next-line react/set-state-in-effect
    loadCustomers(page)
  }, [loadCustomers, page])

  const totalPages = Math.ceil(total / perPage)

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1)
  }

  const handleAddWash = (customerId) => {
    history.push(`/customers/${customerId}/washes/new`)
  }

  const handleDeleteCustomer = (elementId) => {
    setCustomerToDelete(localCustomers.find((x) => x.id === elementId))
    setModalIsVisible(true)
  }

  const handleSubmit = async () => {
    setModalIsVisible(false)
    if (!customerToDelete) return

    try {
      await deleteCustomer(customerToDelete.id)
    } catch (error) {
      reportError(error, 'delete the customer')
      return
    }
    toast.success('Customer deleted')
    loadCustomers(page)
  }

  const reversedCustomers = [...localCustomers].reverse()

  if (loading) {
    return (
      <RecordListSkeleton rows={6} label="Loading customers" />
    )
  }

  return (
    <div className="w-full">
      <ConfirmDialog
        open={modalIsVisible}
        onOpenChange={setModalIsVisible}
        onConfirm={handleSubmit}
        title="Delete customer"
        description={`Are you sure you would like to delete ${customerToDelete?.name ?? 'this customer'}?`}
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
              onDelete={handleDeleteCustomer}
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
                      onDelete={handleDeleteCustomer}
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

      <Button
        variant="ghost"
        className="w-full mt-4 h-auto py-2 text-sm text-muted-foreground hover:text-foreground"
        onClick={handleDownloadCustomers}
      >
        Download CSV
      </Button>
    </div>
  )
}

export default CustomersIndex
