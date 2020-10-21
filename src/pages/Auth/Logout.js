import React, { useEffect } from 'react'

import { useHistory } from 'react-router-dom'

const Logout = () => {
  const history = useHistory()

  useEffect(() => {
    sessionStorage.removeItem('roles')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('id')
    // history.push('')
    window.location.assign(`${process.env.REACT_APP_URL}`)
  }, [])

  return <div></div>
}

export default Logout
