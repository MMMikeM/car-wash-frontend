import React, { useState, useEffect } from 'react'
import { getWashes, updateWashOrder } from '../../services/washTypesApi'
import { List, arrayMove } from 'react-movable'
import type { WashType } from '../../types'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { reportError } from '@/lib/reportError'

const WashesOrder = () => {
  let [washes, setWashes] = useState<WashType[]>([])
  let [loading, setLoading] = useState(true)

  const handleFetchWashes = async () => {
    try {
      let res = await getWashes()
      setWashes([...res].sort((a, b) => a.order - b.order))
    } catch (error) {
      reportError(error, 'load the wash types')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchWashes()
  }, [])

  const handleChange = (washes: WashType[], oldIndex, newIndex) => {
    const newArray = arrayMove<WashType>(washes, oldIndex, newIndex).map(
      (wash, index) => ({ ...wash, order: index })
    )
    setWashes(newArray)
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
      {!loading ? (
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
      ) : (
        ''
      )}
    </div>
  )
}

export default WashesOrder
