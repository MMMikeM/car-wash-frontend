import React, { useState, useEffect } from 'react'
import { Car, Coins, Smartphone, User } from 'lucide-react'
import { postWash } from '../../services/washesApi'
import { getWashes } from '../../services/washTypesApi'
import { getCustomer } from '../../services/customersApi'
import { transformCentsToRands } from '../../helpers'
import BasicTable from '../../components/Tables/BasicTable'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import type { Customer, WashType } from '../../types'
import { reportError } from '@/lib/reportError'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const cardClass = 'text-white bg-3 h-auto m-2 p-2 whitespace-normal'

const SelectCard = ({ label, selected, onSelect }) => (
  <Button
    variant="ghost"
    className={cn(cardClass, selected && 'highlighted')}
    onClick={onSelect}
  >
    <h5 className="py-0 my-0">{label}</h5>
  </Button>
)

const ManageUserWashes = () => {
  const navigate = useNavigate()
  let { id } = useParams()
  let [localCustomer, setLocalCustomer] = useState<Partial<Customer>>({})
  let [washes, setWashes] = useState<WashType[]>([])
  let [loading, setLoading] = useState(true)
  let [submitted, setSubmitted] = useState(false)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [selectedWashId, setSelectedWashId] = useState('')
  let [hasInsurance, setHasInsurance] = useState(false)

  const freeWashPoints = -washes?.filter((wash) => wash.free == true)[0]?.points
  let qualifies = localCustomer.total_points >= freeWashPoints

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        let [resCustomer, resWashes] = await Promise.all([
          getCustomer(id),
          getWashes(),
        ])
        setLocalCustomer(resCustomer)
        setWashes(resWashes)
      } catch (error) {
        reportError(error, 'load this customer')
      } finally {
        setLoading(false)
      }
    }
    handleFetchData()
  }, [id])

  // Free first when the customer qualifies, then by the configured order.
  const selectableWashes = (
    qualifies ? [...washes] : washes.filter((wash) => wash.free === false)
  ).sort((a, b) => Number(b.free) - Number(a.free) || a.order - b.order)

  const toggleWash = (washId: string) =>
    setSelectedWashId(selectedWashId === washId && !loading ? '' : washId)

  let handleProceed = () => {
    setModalIsVisible(true)
  }

  const selectedWash = washes.find((wash) => wash.id === selectedWashId)

  const handleSubmit = async () => {
    if (submitted) return
    setSubmitted(true)
    setModalIsVisible(false)

    try {
      await postWash({
        user_id: id,
        wash_type_id: selectedWashId,
        insurance: hasInsurance,
      })
    } catch (error) {
      // Release the guard so the capture can be retried.
      setSubmitted(false)
      reportError(error, 'capture the wash')
      return
    }

    setSelectedWashId('')
    toast.success('Wash captured')
    navigate(`/customers/${id}`)
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
    <div className="w-full">
      <ConfirmDialog
        open={modalIsVisible}
        onOpenChange={setModalIsVisible}
        onConfirm={handleSubmit}
        title={selectedWash?.name ?? 'Add wash'}
        description="Are you sure you want to add the following wash?"
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Customer</dt>
          <dd>{localCustomer.name}</dd>
          <dt className="text-muted-foreground">Wash type</dt>
          <dd>{selectedWash?.name}</dd>
          <dt className="text-muted-foreground">Price</dt>
          <dd>{selectedWash ? transformCentsToRands(selectedWash.price) : ''}</dd>
        </dl>
      </ConfirmDialog>

      <div className="py-3 mb-3 bg-3 text-8">
        <h2 className="px-4 pb-3 w-full border-b border-primary text-white">
          User Profile
        </h2>
        <div className="px-4 pt-2">
          <p>
            <User className="mr-2 mb-1" />
            Name:{' '}
            <span className="ml-1 mt-1 font-weight-black">
              {localCustomer.name}
            </span>
          </p>
          <p>
            <Car className="mr-2 mb-1" />
            Registration number:{' '}
            <span className="ml-1 mt-1 font-weight-black">
              {registration_list}
            </span>
          </p>
          <p>
            <Coins className="mr-2 mb-1" />
            Total Points:{' '}
            <span className="ml-1 mt-1 font-weight-black">
              {localCustomer.total_points}
            </span>
          </p>
          <p>
            <Smartphone className="mr-2 mb-1" />
            Contact Number:{' '}
            <span className="ml-1 mt-1 font-weight-black">
              {localCustomer.contact_number}
            </span>
          </p>
        </div>
      </div>

      <div className="wash-grid">
        {selectableWashes.map((wash) => (
          <SelectCard
            key={wash.id}
            label={wash.name}
            selected={wash.id === selectedWashId}
            onSelect={() => toggleWash(wash.id)}
          />
        ))}

        <SelectCard
          label="Wash Insurance"
          selected={hasInsurance}
          onSelect={() => setHasInsurance(!hasInsurance)}
        />

        {selectedWashId != '' ? (
          <Button
            className="m-2 h-auto p-2 font-bold"
            disabled={submitted}
            onClick={handleProceed}
          >
            <h5 className="py-0 my-0">
              {!submitted ? 'Proceed' : 'Processing...'}
            </h5>
          </Button>
        ) : (
          ''
        )}
      </div>
      {!loading && localCustomer.washes.length > 0 ? (
        <div className="max-md mx-auto">
          <BasicTable
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
