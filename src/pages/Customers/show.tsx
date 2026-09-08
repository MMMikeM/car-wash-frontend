import React, { useState, useMemo, Suspense } from 'react'
import useSWR from 'swr'
import { Car, Coins, Mail, Smartphone, User } from 'lucide-react'
import { getCustomer } from '../../services/customersApi'
import { getWashes } from '../../services/washTypesApi'
import { Link, useParams } from 'react-router-dom'
import BasicTable from '../../components/Tables/BasicTable'
import { deleteWash } from '../../services/washesApi'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { DetailSkeleton } from '../../components/Loading'
import { currentRoles } from '@/lib/auth'
import { formatDateTime, isAnonymousEmail } from '../../helpers'
import { reportError } from '@/lib/reportError'
import { toast } from '@/components/ui/toast'


const CustomersShowContent = () => {
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [selectedWash, setSelectedWash] = useState('')

  let { id } = useParams()

  // Two reads, one boundary: they resolve in parallel and the page waits once.
  const { data: localCustomer, mutate } = useSWR(['the customer', id], () =>
    getCustomer(id)
  )
  const { data: washes } = useSWR('the wash types', getWashes)

  const handleClick = async (wash) => {
    setSelectedWash(wash.id)
    setModalIsVisible(true)
  }

  const handleSubmit = async () => {
    setModalIsVisible(false)
    try {
      await deleteWash(selectedWash)
    } catch (error) {
      reportError(error, 'delete the wash')
      return
    }
    toast.success('Wash deleted')
    mutate()
  }

  // Derived rather than mutated in place: these rows are rebuilt each render.
  const washRows = useMemo(
    () =>
      (localCustomer?.washes ?? []).map((item) => ({
        ...item,
        wash: washes.find((wash) => item.wash_type_id === wash.id)?.name,
        created_at: formatDateTime(new Date(item.created_at)),
      })),
    [localCustomer, washes]
  )

  const email = isAnonymousEmail(localCustomer?.email)
    ? 'No email provided'
    : localCustomer?.email

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

  let roles = currentRoles()

  return (
    <div>
      <ConfirmDialog
        open={modalIsVisible}
        onOpenChange={setModalIsVisible}
        onConfirm={handleSubmit}
        title="Delete wash"
        description="Are you sure you would like to delete this wash?"
        confirmLabel="Delete"
        destructive
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Customer</dt>
          <dd>{localCustomer.name}</dd>
          <dt className="text-muted-foreground">Wash</dt>
          <dd>{washRows.find((row) => row.id === selectedWash)?.wash}</dd>
          <dt className="text-muted-foreground">Date</dt>
          <dd>{washRows.find((row) => row.id === selectedWash)?.created_at}</dd>
        </dl>
      </ConfirmDialog>

      <div className="text-8 flex justify-center flex-col max-sm bg-3 px-4 pt-4 pb-3 rounded">
        <div className="flex flex-col px-2 pt-2">
          <p>
            <User className="mr-2 mb-1 text-white" />
            Name:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.name}
            </span>
          </p>
          <p>
            <Mail className="mr-2 mb-1 text-white" />
            Email:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {email}
            </span>
          </p>
          <p>
            <Smartphone className="mr-2 mb-1 text-white" />
            Contact number:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.contact_number}
            </span>
          </p>
          <p>
            <Coins className="mr-2 mb-1 text-white" />
            Total Points:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {localCustomer.total_points}
            </span>
          </p>
          <p>
            <Car className="mr-2 mb-1 text-white" />
            Registration:{' '}
            <span className="text-white ml-1 mt-1 font-weight-black">
              {registration_list}
            </span>
          </p>
        </div>
        <div className="flex justify-between mt-2">
          <Button
            className="mb-2 mr-2"
            render={
              <Link
                to={`/${localCustomer.id}/password_reset`}
                className="text-primary-foreground! no-underline!"
              />
            }
          >
            Reset password
          </Button>
          <Button
            className="mb-2"
            render={
              <Link
                to={`/customers/${localCustomer.id}/washes/new`}
                className="text-primary-foreground! no-underline!"
              />
            }
          >
            Add wash
          </Button>
        </div>
      </div>
      {washRows.length > 0 ? (
        <div className="mt-4">
          <BasicTable
            records={washRows}
            fields={['wash', 'created_at']}
            headings={['Wash Type', 'created_at']}
            renderActions={
              roles.includes('manager')
                ? (wash) => (
                    <Button variant="link" onClick={() => handleClick(wash)}>
                      Delete Wash
                    </Button>
                  )
                : null
            }
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

const CustomersShow = () => (
  <Suspense fallback={<DetailSkeleton label="Loading the customer" />}>
    <CustomersShowContent />
  </Suspense>
)

export default CustomersShow
