import React, { useState, useEffect } from 'react'
import { getWashes, updateWashOrder } from '../../services/washTypesApi'
import { List, arrayMove } from 'react-movable'
import type { WashType } from '../../types'
import { Button } from '@/components/ui/button'

const WashesOrder = () => {
  let [washes, setWashes] = useState<WashType[]>([])
  let [loading, setLoading] = useState(true)

  const handleFetchWashes = async () => {
    let res = await getWashes()
    console.log(res)
    console.log(res.sort((a, b) => (a.order - b.order ? -1 : 1)))
    console.log(await res.sort((a, b) => (a.order - b.order ? -1 : 1)))
    let sorted = res.sort((a, b) => (a.order - b.order ? -1 : 1))
    // let renumbered = sorted.map((wash, index) => {
    //   let temp = wash
    //   wash.order = index
    //   return temp
    // })
    console.log(sorted)
    setWashes(sorted)
    setLoading(false)
  }

  useEffect(() => {
    handleFetchWashes()
  }, [])

  const handleChange = (washes: WashType[], oldIndex, newIndex) => {
    let newArray = arrayMove<WashType>(washes, oldIndex, newIndex).map((wash, index) => {
      wash.order = index
      return wash
    })
    setWashes(newArray)
    return newArray
  }

  const handleClick = () => {
    updateWashOrder(washes)
    alert('Wash order updated')
  }

  return (
    <div className="w-100">
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
              renderItem={({ value, props }) => (
                <div
                  {...props}
                  className="text-white border-custom bg-3 py-2 px-4 m-2"
                >
                  {value.name}
                </div>
              )}
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
