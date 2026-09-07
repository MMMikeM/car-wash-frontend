import React, { useState, useEffect } from 'react'
import { getWashes } from '../../services/washTypesApi'
import BasicTable from '../../components/Tables/BasicTable'
import { useHistory } from 'react-router-dom'
import { transformWashesCentsToRands } from '../../helpers'
import { reportError } from '@/lib/reportError'
import { Button } from '@/components/ui/button'

const Settings = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)
  const history = useHistory()

  const handleFetchWashes = async () => {
    try {
      let res = await getWashes()
      setWashes(transformWashesCentsToRands(res))
    } catch (error) {
      reportError(error, 'load the wash types')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchWashes()
  }, [])

  const editFreeWash = (wash) => {
    history.push(`settings/${wash.id}/edit`)
  }

  return (
    <div className="w-full">
      {!loading ? (
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
      ) : (
        ''
      )}
    </div>
  )
}

export default Settings
