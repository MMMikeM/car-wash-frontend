import React, { useState } from 'react'
import useSWR from 'swr'
import Washes from '../Washes/customerIndex'
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { getCustomer } from '../../services/customersApi'
import type { Customer } from '../../types'
import { reportError } from '@/lib/reportError'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CustomerHome = () => {
  let [isViewingPrice, setIsViewingPrice] = useState(false)

  // Not suspended: the greeting and the ring sit among static copy, so the
  // placeholders go inside the headings rather than replacing the page.
  const { data, isLoading } = useSWR(
    ['the customer', sessionStorage.getItem('id')],
    () => getCustomer(sessionStorage.getItem('id')),
    // Opting out of Suspense opts out of the boundary, so this reports itself.
    { suspense: false, onError: (error) => reportError(error, 'load your profile') }
  )
  const localCustomer: Partial<Customer> = data ?? {}


  let classCreator = (bgNumber) =>
    `bg-${bgNumber} w-1/2 text-primary hover:text-primary/80 rounded-0 btn-link py-0 border-0 d-block button-to-link h-full`
  let pricesPage = classCreator(isViewingPrice ? 2 : 4)
  let accountPage = classCreator(isViewingPrice ? 4 : 2)

  return (
    <div>
      {!isViewingPrice ? (
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 justify-items-between">
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <h4 className="text-9 my-3 mx-3" aria-busy={isLoading}>
                Welcome{' '}
                {isLoading ? (
                  <Skeleton className="inline-block h-[1em] w-32 align-middle" />
                ) : (
                  localCustomer.name
                )}
                !
              </h4>
              <h4 className="text-7 my-3 mx-3" aria-busy={isLoading}>
                You have{' '}
                <span className="text-primary">
                  {isLoading ? (
                    <Skeleton className="inline-block h-[1em] w-10 align-middle" />
                  ) : (
                    localCustomer.total_points
                  )}
                </span>{' '}
                Carbon Coins!
              </h4>
            </div>
          </div>
          <div className="max-sm mx-auto flex justify-center px-5 py-5 mb-5">
            <div style={{ width: '240px' }}>
              <CircularProgressbarWithChildren
                value={localCustomer.total_points ?? 0}
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
                    src="/coin.png"
                    alt="coin"
                  />
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
          <div className="text-small max-md mx-auto mb-5 pb-5 pt-3">
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
        <div className="w-full pb-16">
          <Washes />
        </div>
      )}

      <div className="footer flex">
        <Button
          variant="ghost"
          onClick={() => setIsViewingPrice(false)}
          className={cn('h-full rounded-none', accountPage)}
        >
          Account
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsViewingPrice(true)}
          className={cn('h-full rounded-none', pricesPage)}
        >
          Prices
        </Button>
      </div>
    </div>
  )
}

export default CustomerHome
