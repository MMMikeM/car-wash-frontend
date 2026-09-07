import React from 'react'
import {
  FaFacebookSquare,
  FaInstagram,
  FaMapMarkedAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa'

export const MAPS_URL =
  'https://www.google.co.za/maps/place/Carbon+Car+Wash/@-26.07635,27.9875213,17z/data=!3m1!4b1!4m5!3m4!1s0x1e9575db8680ed37:0xc28f2b89f1535df7!8m2!3d-26.07635!4d27.98971'

const contacts = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/Carbon-Car-Wash-106707361113638/',
    Icon: FaFacebookSquare,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/carbon_car_wash/',
    Icon: FaInstagram,
  },
  { name: 'Location', href: MAPS_URL, Icon: FaMapMarkedAlt },
  { name: 'Call us', href: 'tel:+27113260554', Icon: FaPhone },
  { name: 'Email us', href: 'mailto:info@carboncarwash.co.za', Icon: FaEnvelope },
]

const Links = () => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {contacts.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          className="inline-flex items-center gap-2 rounded-full border-[1px] border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-foreground! no-underline! transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary!"
        >
          <Icon className="text-base" />
          {name}
        </a>
      ))}
    </div>
  )
}

export default Links
