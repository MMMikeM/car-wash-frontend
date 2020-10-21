import React, { useState, useEffect } from 'react'
import Washes from '../Washes/customerIndex'
import Links from '../../components/Links'
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { getCustomer } from '../../services/customersApi.js'

const CustomerHome = () => {
  let [localCustomer, setLocalCustomer] = useState({})
  let [loading, setLoading] = useState(true)
  let [isViewingPrice, setIsViewingPrice] = useState(false)

  const handleFetchCustomer = async () => {
    let res = await getCustomer(sessionStorage.getItem('id'))
    setLocalCustomer(res)
    setLoading(false)
  }
  useEffect(() => {
    handleFetchCustomer()
  }, [])

  let classCreator = (bgNumber) =>
    `bg-${bgNumber} w-50 link-primary rounded-0 btn-link py-0 border-0 d-block button-to-link h-100`
  let pricesPage = classCreator(isViewingPrice ? 2 : 4)
  let accountPage = classCreator(isViewingPrice ? 4 : 2)

  return (
    <div>
      {!isViewingPrice ? (
        <div className="container d-flex flex-column justify-items-between">
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column align-items-center">
              <h4 className="text-9 my-3 mx-3 ">
                Welcome {localCustomer.name}!
              </h4>
              <h4 className="text-7 my-3 mx-3">
                You have{' '}
                <span className="text-primary">
                  {localCustomer.total_points}
                </span>{' '}
                Carbon Coins!
              </h4>
            </div>
          </div>
          <div className="max-sm mx-auto d-flex justify-content-center px-5 py-5 mb-5">
            <div style={{ width: '240px' }}>
              <CircularProgressbarWithChildren
                value={localCustomer.total_points}
                strokeWidth={4}
                styles={buildStyles({
                  strokeLinecap: 'butt',
                  pathColor: `#b4f997`,
                  trailColor: '#999999',
                  backgroundColor: '#3e98c7',
                })}
              >
                <div>
                  <img
                    style={{ width: '180px', marginTop: 0 }}
                    src="/public/coin.png"
                    alt="coin"
                  />
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
          <div className="text-small pt-5 max-md mx-auto mb-5 pb-5 pt-3">
            <p className="text-9">
              *T’s & C’s. Complimentary Disinfectant Fogging Included in Full
              House And CARBON Treatment When Available. Carbon Loyalty
              Programme Is Subject To Change.
            </p>
            <p className="text-9 pb-5">
              DISCLAIMER NOTICE The owner its employees, agents or contractors
              do not accept or take responsibility or liability for the safe
              custody of any vehicle or articles therein, nor for any damage to
              vehicle or articles therein, nor any persons or death as a result
              of collision, fire, theft, robbery, rain, hail or any cause. RIGHT
              OF ADMISSION RESERVED
            </p>
          </div>
        </div>
      ) : (
        <div className="">
          <Links />
          <Washes />
        </div>
      )}

      <div className="footer d-flex">
        <button
          onClick={() => setIsViewingPrice(false)}
          className={accountPage}
        >
          Account
        </button>
        <button onClick={() => setIsViewingPrice(true)} className={pricesPage}>
          Prices
        </button>
      </div>
    </div>
  )
}

export default CustomerHome
