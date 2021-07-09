import React, { useState, useEffect } from 'react'
import { getWashes, deleteWash } from '../../services/washTypesApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { Link } from 'react-router-dom'
import { transformWashesCentsToRands } from '../../helpers.js'

const WashesIndex = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)

  const handleFetchWashes = async () => {
    let res = await getWashes()
    let transformedWashes = transformWashesCentsToRands(res)
    setWashes(transformedWashes)
    setLoading(false)
  }

  useEffect(() => {
    handleFetchWashes()
  }, [])

  const handleDeleteWash = async (washId) => {
    let mustDeletewash = window.confirm(
      'Are you sure you want to delete this Wash Option?'
    )

    if (mustDeletewash) {
      setLoading(!loading)
      await deleteWash(washId)
      handleFetchWashes()
    }
  }

  return (
    <div className="w-100">
      {!loading ? (
        <div className="row">
          <div className="col-md-9"></div>
          <div className="col-md-3 text-right">
            <Link className="btn btn-primary px-4 py-2" to="/wash_types/new">
              Add Wash
            </Link>
          </div>
          <div className="col-md-12">
            <BasicTable
              rowType={'wash_types'}
              records={washes
                .filter((wash) => wash.free === false)
                .sort((a, b) => (a.order > b.order ? 1 : -1))}
              crudEnabled={true}
              deleteMethod={handleDeleteWash}
              headings={['name', 'cost', 'price', 'points', 'order']}
              fields={['name', 'cost', 'price', 'points', 'order']}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default WashesIndex
