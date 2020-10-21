import React from 'react'
import {
  FaFacebookSquare,
  FaInstagram,
  FaMapMarkedAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa'

const Links = () => {
  return (
    <div className="mb-4">
      <div className="d-flex flex-row justify-content-center mb-2">
        <div className="w-100 d-flex justify-content-center flex-wrap">
          <a
            href="https://www.facebook.com/Carbon-Car-Wash-106707361113638/"
            className="h6 mx-3"
          >
            <FaFacebookSquare className="mr-2 mt-1 h5" />
            Facebook
          </a>
          <a
            href="
        https://www.instagram.com/carbon_car_wash/
        "
            className="h6 mx-3"
          >
            <FaInstagram className="mr-2 mt-1 h5" />
            Instagram
          </a>
          <a
            href="
          https://www.google.co.za/maps/place/Carbon+Car+Wash/@-26.07635,27.9875213,17z/data=!3m1!4b1!4m5!3m4!1s0x1e9575db8680ed37:0xc28f2b89f1535df7!8m2!3d-26.07635!4d27.98971        "
            className="h6 mx-3"
          >
            <FaMapMarkedAlt className="mr-2 mt-1 h5" />
            Location
          </a>
          <a href="tel:+27113260554" className="h6 mx-3">
            <FaPhone className="mr-2 mt-1 h5" />
            Call us
          </a>
          <a href="mailto:info@carboncarwash.co.za" className="h6 mx-3">
            <FaEnvelope className="mr-2 mt-1 h5" />
            Email us
          </a>
        </div>
      </div>
    </div>
  )
}

export default Links
