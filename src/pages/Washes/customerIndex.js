import React, { useState, useEffect } from 'react'
import BasicCard from '../../components/BasicCard'
import { getWashes } from '../../services/washTypesApi'
import { transformWashesCentsToRands } from '../../helpers'

const Washes = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)
  useEffect(() => {
    handleFetchWashes()
  }, [])

  const handleFetchWashes = async () => {
    let res = await getWashes()
    let transformedWashes = transformWashesCentsToRands(res)
    setWashes(transformedWashes)
    setLoading(false)
  }

  return (
    <div className="">
      <div className="d-flex flex-row justify-content-center">
        <img
          alt="Company logo"
          src="/public/logo.png"
          style={{ width: '200px', height: '116px' }}
          className="mx-auto mb-5"
        />
      </div>
      <div className="d-flex flex-row justify-content-center">
        <h4 className="text-white my-5">
          Earn Carbon Coins With Our Carbon Loyalty Program
        </h4>
      </div>

      <div className="d-flex flex-wrap justify-content-center">
        {!loading ? (
          <BasicCard
            data={washes
              .filter((wash) => wash.free == false)
              .sort((wash_a, wash_b) => wash_a.order > wash_b.order)}
          />
        ) : (
          ''
        )}
      </div>

      <div className="text-small pt-5 max-md mx-auto mb-5 px-3">
        <p className="text-9">
          *T’s & C’s. Complimentary Disinfectant Fogging Included in Full House
          And CARBON Treatment When Available. Carbon Loyalty Programme Is
          Subject To Change.
        </p>
        <p className="text-9 pb-5">
          DISCLAIMER NOTICE The owner its employees, agents or contractors do
          not accept or take responsibility or liability for the safe custody of
          any vehicle or articles therein, nor for any damage to vehicle or
          articles therein, nor any persons or death as a result of collision,
          fire, theft, robbery, rain, hail or any cause. RIGHT OF ADMISSION
          RESERVED
        </p>
      </div>
    </div>
  )
}

export default Washes
