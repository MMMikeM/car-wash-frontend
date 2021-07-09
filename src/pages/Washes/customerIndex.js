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
      <div className="d-flex flex-column align-items-center justify-content-center">
        <img
          alt="Company logo"
          src="/public/logo.png"
          style={{ width: '200px', height: '116px' }}
          className="mx-auto mb-5 mt-2"
        />
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h3 className="text-white mt-3 pr-2">
          448 Vale Avenue, Ferndale, Johannesburg
        </h3>
      <div className="d-flex flex-row justify-content-center align-items-center">
          <h4 className="text-white my-3 pr-2">
            Earn Carbon Coins 
            With Our Carbon Loyalty Program
          <img
            alt="icon"
            src="/public/coin.png"
            style={{ width: '24px', height: '24px', marginLeft: '6px'  }}
            />
          </h4>
        </div>

        <h4 className="text-white mt-3 mb-5 pr-2">
          Carbon Coins May Be Redeemed For A Free Wash <span className="h6 text-9">(T’s & C’s Apply)</span>
        </h4>
      </div>

      <div className="d-flex flex-wrap justify-content-center">
        {!loading ? (
          <BasicCard
            data={washes
              .filter((wash) => wash.free == false)
              .sort((a, b) => a.order > b.order  ? 1 : -1)}
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
        <p className="text-9">
          DISCLAIMER NOTICE The owner its employees, agents or contractors do
          not accept or take responsibility or liability for the safe custody of
          any vehicle or articles therein, nor for any damage to vehicle or
          articles therein, nor any persons or death as a result of collision,
          fire, theft, robbery, rain, hail or any cause. RIGHT OF ADMISSION
          RESERVED
        </p>
        <p className="text-9">24hr Rain Insurance:</p>
        <ol className="text-9">
          <li>
            Subject to purchase of Carbon 24hr Rain Insurance in conjunction
            with a Carbon Wash.
          </li>
          <li>
            Cover qualifies for a Carbon Wash, Dry & Tyre Shine; subject to T's
            & C's.
          </li>
          <li>
            Redeemable only in the event of rain & vehicle directly soiled by
            rain.
          </li>
          <li>Cover valid for 24hrs from time of purchase.</li>
          <li>Valid for a once-off redemption only.</li>
          <li>
            Cover is vehicle specific & non-transferable between vehicles.
          </li>
          <li>
            If Carbon Car Wash is inoperative due to unforseen circumstances or
            inclement weather; no extention of the 24hr cover period shall be
            applied.
          </li>
          <li>
            Carbon Car Wash reserves the right to amend or terminate this offer
            without notice and shall be absolved from any liability that may
            arise.
          </li>
          <li>
            By participating in this offering the customer agrees to be bound by
            these Terms & Conditions
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Washes
