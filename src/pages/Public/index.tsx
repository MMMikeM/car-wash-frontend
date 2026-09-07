import React from 'react'
import { Link } from 'react-router-dom'
import Washes from '../Washes/customerIndex'
import { Button } from '@/components/ui/button'

const Public = () => {
  return (
    <div className="w-full pb-16">
      <Washes />

      <section className="mt-16 flex flex-col items-center gap-4 px-4 text-center">
        <h2 className="font-heading mb-0! text-2xl! uppercase tracking-wide text-foreground">
          Join the loyalty programme
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            render={
              <Link to="/sign_up" className="text-primary-foreground! no-underline!" />
            }
          >
            Sign up
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link to="/login" className="text-primary! no-underline!" />}
          >
            Log in
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Public
