import React, { useState } from 'react'
import { z } from 'zod'
import { validate } from '../../lib/validate'
import { useHistory } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import HomeTile from '@/components/HomeTile'
import { ClipboardList, ChartColumn, CarFront } from 'lucide-react'

// The walk-in customer every wash without a loyalty account is booked against.
const WALK_IN_CUSTOMER_ID = 'e92d521d-0628-4cb3-8252-02d5d65272e5'

const SalesHome = () => {
  let [inputValue, setInputValue] = useState('')
  const history = useHistory()

  const redirect = async () => {
    let valid = validate(schema, inputValue)
    if (valid) {
      history.push(`/search/q?contact_number=${inputValue}`)
    }
  }

  const schema = z
    .string({ error: 'Please enter a valid registration number' })
    .min(3, 'Please enter at least 3 characters')

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-3xl px-4">
        <form
          className="rounded-2xl border-[1px] border-white/10 bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault()
            redirect()
          }}
        >
          <label
            htmlFor="contact_number"
            className="text-sm text-muted-foreground"
          >
            Customer contact number
          </label>
          <input
            id="contact_number"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            placeholder="082 000 0000"
            className="mt-2 block h-16 w-full rounded-xl border-[1px] border-white/10 bg-background px-4 text-2xl text-foreground outline-none focus:border-primary"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" size="lg" className="mt-4 h-14 w-full text-base">
            Search
          </Button>
        </form>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <HomeTile
            name="Walk-in wash"
            Icon={CarFront}
            onClick={() =>
              history.push(`/customers/${WALK_IN_CUSTOMER_ID}/washes/new/`)
            }
          />
          <HomeTile
            name="Customers Today"
            Icon={ClipboardList}
            path="/customers/report"
          />
          <HomeTile
            name="Daily Washes"
            Icon={ChartColumn}
            path="/customers/daily_wash_list"
          />
        </div>
      </div>
    </div>
  )
}

export default SalesHome
