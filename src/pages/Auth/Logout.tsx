import React, { useEffect } from 'react'

const Logout = () => {
  useEffect(() => {
    sessionStorage.removeItem('roles')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('id')
    window.location.assign(`${import.meta.env.REACT_APP_URL}`)
  }, [])

  return <div></div>
}

export default Logout
