import React from 'react'
import useSWR from 'swr'
import { getWashes } from '../../services/washTypesApi'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory } from 'react-router-dom'
import { transformWashesCentsToRands } from '../../helpers'
import { Button } from '@/components/ui/button'
import { ListSkeleton } from '../../components/Loading'

const Settings = () => {
  const history = useHistory()


  const { data, isLoading } = useSWR('the wash types', getWashes)
  const washes = data ? transformWashesCentsToRands(data) : []

  const editFreeWash = (wash) => {
    history.push(`settings/${wash.id}/edit`)
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <ListSkeleton rows={2} columns={3} label="Loading the free washes" />
      </div>
    )
  }

  return (
    <div className="w-full">
        <div className="flex flex-wrap max-md mx-auto">
          {/* <div className="w-full md:w-3/4"></div>
          <div className="w-full md:w-1/4 text-right">
            <Link className="px-4 py-2" to="/wash_types/new">
              Add Wash
            </Link>
          </div> */}
          <div className="w-full">
            <BasicTable
              records={washes.filter((wash) => wash.free == true)}
              headings={['name', 'cost', 'points']}
              fields={['name', 'cost', 'points']}
              renderActions={(wash) => (
                <Button variant="link" onClick={() => editFreeWash(wash)}>
                  Edit Free Wash
                </Button>
              )}
            />
          </div>
        </div>
    </div>
  )
}

export default Settings
