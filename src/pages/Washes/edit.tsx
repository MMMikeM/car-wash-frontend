import React, { useState } from 'react'
import useSWR from 'swr'
import { getWash, saveWash } from '../../services/washTypesApi'
import BasicForm from '../../components/Forms/BasicForm'
import { useParams, useHistory } from 'react-router-dom'
import { reportError } from '@/lib/reportError'
import { centsToRands } from '../../helpers'
import type { WashType } from '../../types'
import { FormSkeleton } from '../../components/Loading'

const WashEdit = () => {
  const [draft, setDraft] = useState<Partial<WashType>>()

  const history = useHistory()
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
    const { name, cost, price, points, description, order } = localWash
    try {
      await saveWash(localWash.id, { name, cost, price, points, description, order })
    } catch (error) {
      reportError(error, 'save the wash type')
      return
    }
    history.push(`/wash_types/${id}`)
  }

  const { data, isLoading } = useSWR(['the wash type', id], () => getWash(id))
  const localWash: Partial<WashType> = draft ?? data ?? {}

  if (isLoading) {
    return (
      <div className="w-full">
      <div className="max-sm mx-auto rounded">
          <FormSkeleton fields={5} label="Loading the wash type" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="max-sm mx-auto rounded">
          <BasicForm
            editRecordMethod={editRecordMethod}
            record={localWash}
            saveFormData={save}
            editableKeys={[
              'name',
              'cost',
              'price',
              'points',
              'description',
              'order',
            ]}
            valueTransformations={['', centsToRands, centsToRands, '', '', '']}
          />
      </div>
    </div>
  )
}

export default WashEdit
