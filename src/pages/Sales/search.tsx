import React, { Suspense } from 'react'
import useSWR from 'swr'
import { searchCustomer } from '../../services/customersApi'
import BasicTable from '../../components/Tables/BasicTable'

import { useNavigate } from 'react-router-dom'
import { useQueryParam } from '@/hooks/useQueryParam'
import { Button } from '@/components/ui/button'
import { ListSkeleton } from '../../components/Loading'

const SearchResults = ({ contactNumber }: { contactNumber: string | null }) => {
  const navigate = useNavigate()
  const { data } = useSWR(['the search results', contactNumber], () =>
    searchCustomer('contact_number', contactNumber ?? '')
  )

  if (data.data.length === 0) {
    return (
      <div className="max-md mx-auto search">
        <h4 className="text-white">No user found</h4>
        <div className="flex justify-between mt-2">
          <Button
            className="px-5"
            onClick={() => navigate(`/new_customer/q?contact=${contactNumber}`)}
          >
            Create new customer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-md mx-auto search">
      <BasicTable
        records={data.data}
        fields={['name', 'vehicles/registration_number', 'contact_number']}
        headings={['name', 'vehicles/registration_number', 'contact_number']}
        renderActions={(customer) => (
          <>
            <Button
              variant="link"
              onClick={() => navigate(`/sales/${customer.id}/vehicles/new`)}
            >
              Add Registration
            </Button>
            <Button
              variant="link"
              onClick={() => navigate(`/customers/${customer.id}/washes/new`)}
            >
              Add Wash
            </Button>
          </>
        )}
      />

      <div className="flex justify-between mt-2">
        <Button
          className="px-5"
          onClick={() => navigate(`/new_customer/q?contact=${contactNumber}`)}
        >
          Create new customer
        </Button>
      </div>
    </div>
  )
}

const SearchCustomer = () => {
  const contactNumber = useQueryParam('contact_number')

  return (
    <div className="w-full">
      <div className="flex flex-row justify-center flex-wrap">
        <img
          alt="Company logo"
          src="/logo.png"
          style={{ width: '200px' }}
          className="mx-auto mb-5"
        />
      </div>
      <Suspense
        fallback={<ListSkeleton rows={3} columns={3} label="Searching" />}
      >
        <SearchResults contactNumber={contactNumber} />
      </Suspense>
    </div>
  )
}

export default SearchCustomer
