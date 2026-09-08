import React, { useState, Suspense } from 'react'
import useSWR from 'swr'
import { getWash, saveWash } from '../../services/washTypesApi'
import BasicForm from '../../components/Forms/BasicForm'
import { useParams, useNavigate } from 'react-router-dom'
import { reportError } from '@/lib/reportError'
import { centsToRands } from '../../helpers'
import type { WashType } from '../../types'
import { FormSkeleton } from '../../components/Loading'

const WashFreeEditContent = () => {
  const [draft, setDraft] = useState<Partial<WashType>>()

  const navigate = useNavigate()
  let { id } = useParams()

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    if (['price', 'cost'].includes(key)) {
      tempRecord[key] = value * 100
    } else {
      tempRecord[key] = value
    }
    setDraft(tempRecord)
  }

  const save = async () => {
    const { name, cost, points, description } = localWash
    try {
      await saveWash(localWash.id, { name, cost, points, description })
    } catch (error) {
      reportError(error, 'save the wash type')
      return
    }
    navigate(`/wash_types/${id}`)
  }

  const { data } = useSWR(['the wash type', id], () => getWash(id))
  const localWash: Partial<WashType> = draft ?? data ?? {}


  return (
    <div className="w-full">
      <div className="max-sm mx-auto bg-3 p-5 rounded">
          <BasicForm
            editRecordMethod={editRecordMethod}
            record={localWash}
            saveFormData={save}
            editableKeys={['name', 'cost', 'points', 'description']}
            valueTransformations={['', centsToRands, '', '']}
          />
      </div>
    </div>
  )
}

const WashFreeEdit = () => (
  <Suspense fallback={<div className="w-full">
      <div className="max-sm mx-auto bg-3 p-5 rounded">
          <FormSkeleton fields={4} label="Loading the wash type" />
        </div>
      </div>}>
    <WashFreeEditContent />
  </Suspense>
)

export default WashFreeEdit
