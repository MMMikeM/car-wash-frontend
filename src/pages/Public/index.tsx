import React from 'react'
import Washes from '../Washes/customerIndex'
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import Links from '../../components/Links'

const Public = () => {
  return (
    <div>
      <Links />
      <Washes />
    </div>
  )
}

export default Public
