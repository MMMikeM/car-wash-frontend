import React, { useState, Suspense } from 'react'
import useSWR from 'swr'
import { getWashes, updateWashOrder } from '../../services/washTypesApi'
import { List, arrayMove } from 'react-movable'
import type { WashType } from '../../types'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { reportError } from '@/lib/reportError'
import { ListSkeleton } from '../../components/Loading'

const WashesOrderContent = () => {
  const { data } = useSWR('the wash order', getWashes)
  const [draft, setDraft] = useState<WashType[]>()
  const washes = draft ?? [...data].sort((a, b) => a.order - b.order)

  const handleChange = (current: WashType[], oldIndex, newIndex) => {
    const newArray = arrayMove<WashType>(current, oldIndex, newIndex).map(
      (wash, index) => ({ ...wash, order: index })
    )
    setDraft(newArray)
    return newArray
  }

  const handleClick = async () => {
    try {
      await updateWashOrder(washes)
    } catch (error) {
      reportError(error, 'save the wash order')
      return
    }
    toast.success('Wash order updated')
  }

  return (
    <div className="w-full">
        <>
          <div
            style={{ margin: 'auto', display: 'flex', justifyContent: 'start' }}
          >
            <List
              values={washes}
              onChange={({ oldIndex, newIndex }) => {
                handleChange(washes, oldIndex, newIndex)
              }}
              renderList={({ children, props }) => (
                <ul {...props}>{children}</ul>
              )}
              renderItem={({ value, props }) => {
                const { key, ...rest } = props
                return (
                  <div
                    key={key}
                    {...rest}
                    className="text-white border-custom bg-3 py-2 px-4 m-2"
                  >
                    {value.name}
                  </div>
                )
              }}
            />
          </div>
          <Button
            className="mt-3 px-4 py-2"
            onClick={() => {
              handleClick()
            }}
          >
            Save order
          </Button>
        </>
    </div>
  )
}

const WashesOrder = () => (
  <Suspense
    fallback={
      <ListSkeleton rows={8} columns={2} actions={false} label="Loading the wash order" />
    }
  >
    <WashesOrderContent />
  </Suspense>
)

export default WashesOrder
