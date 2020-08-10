import React, { useState, useEffect } from 'react'
import { getWashes, deleteWash } from '../../services/washTypesApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { useParams, useHistory } from 'react-router-dom'
import { transformWashesCentsToRands } from '../../helpers.js'

const Settings = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)
  const history = useHistory()
  let { id } = useParams()

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

  const editFreeWash = (e) => {
    history.push(`settings/${e.currentTarget.parentNode.id}/edit`)
  }

  return (
    <div className="w-100">
      {!loading ? (
        <div className="row max-md mx-auto">
          {/* <div className="col-md-9"></div>
          <div className="col-md-3 text-right">
            <Link className="btn btn-primary px-4 py-2" to="/wash_types/new">
              Add Wash
            </Link>
          </div> */}
          <div className="col-md-12">
            <BasicTable
              rowType={'wash_types'}
              records={washes.filter((wash) => wash.free == true)}
              deleteMethod={handleDeleteWash}
              headings={['name', 'cost', 'points']}
              fields={['name', 'cost', 'points']}
              crudEnabled={false}
              extraButtons={[
                <button
                  className="link-primary btn btn-link py-0 border-0 d-block button-to-link"
                  onClick={(e) => editFreeWash(e)}
                >
                  Edit Free Wash
                </button>,
              ]}
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
