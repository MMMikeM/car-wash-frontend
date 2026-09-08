import React, { Suspense } from 'react'
import useSWR from 'swr'
import BasicCard from '../../components/BasicCard'
import Links, { MAPS_URL } from '../../components/Links'
import { getWashes } from '../../services/washTypesApi'
import { transformWashesCentsToRands } from '../../helpers'
import { CardGridSkeleton } from '../../components/Loading'

const PriceGrid = () => {
  const { data } = useSWR('the wash prices', getWashes)
  const priced = transformWashesCentsToRands(data)
    .filter((wash) => wash.free == false)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
      <BasicCard data={priced} />
    </div>
  )
}

const Washes = () => {
  return (
    <div className="w-full">
      <section className="flex flex-col items-center px-4 pb-10 text-center">
        <img
          alt="Company logo"
          src="/logo.png"
          style={{ width: '220px', height: '128px' }}
        />
        <a
          href={MAPS_URL}
          className="mt-6 text-sm text-muted-foreground! no-underline! transition-colors hover:text-primary!"
        >
          448 Vale Avenue, Ferndale, Johannesburg
        </a>

        <div className="mt-6">
          <Links />
        </div>

        <div className="mt-8 w-full max-w-2xl rounded-2xl border border-primary/25 bg-primary/5 px-6 py-6">
          <img
            alt="Carbon Coin"
            src="/coin.png"
            style={{ width: '40px', height: '40px' }}
            className="mx-auto"
          />
          <h2 className="font-heading mt-4 mb-0! text-3xl! uppercase tracking-wide text-primary">
            Earn Carbon Coins
          </h2>
          <p className="mt-2 text-base text-foreground">
            With our Carbon Loyalty Program, coins may be redeemed for a free
            wash.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">T's &amp; C's apply</p>
        </div>
      </section>

      <section className="px-4">
        <h2 className="font-heading mb-6! text-center text-2xl! uppercase tracking-wide text-muted-foreground">
          Our Washes
        </h2>
        <Suspense
          fallback={
            <CardGridSkeleton cards={9} label="Loading the wash prices" />
          }
        >
          <PriceGrid />
        </Suspense>
      </section>

      <details className="mx-auto mt-16 max-w-4xl px-4 text-sm">
        <summary className="mx-auto w-fit cursor-pointer list-none rounded-full border border-white/10 bg-white/5 px-4 py-2 text-muted-foreground transition-colors hover:text-foreground">
          Terms &amp; Conditions
        </summary>
        <div className="text-small mt-4 space-y-3 text-muted-foreground">
          <p>
            *T’s & C’s. Complimentary Disinfectant Fogging Included in Full House
            And CARBON Treatment When Available. Carbon Loyalty Programme Is
            Subject To Change.
          </p>
          <p>
            DISCLAIMER NOTICE The owner its employees, agents or contractors do
            not accept or take responsibility or liability for the safe custody of
            any vehicle or articles therein, nor for any damage to vehicle or
            articles therein, nor any persons or death as a result of collision,
            fire, theft, robbery, rain, hail or any cause. RIGHT OF ADMISSION
            RESERVED
          </p>
          <p>24hr Rain Insurance:</p>
          <ol className="list-decimal space-y-1 pl-6">
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
      </details>
    </div>
  )
}

export default Washes
