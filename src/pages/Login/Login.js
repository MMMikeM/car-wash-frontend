import React, { useState, useEffect } from 'react'
import { login } from '../../services/authApi'
import { useHistory } from 'react-router-dom'

const Login = () => {
  let [loginCredsEmail, setLoginCredsEmail] = useState('')
  let [loginCredsPassword, setLoginCredsPassword] = useState('')
  let [isLoggedIn, setLoggedIn] = useState(false)
  let [isLoading, setIsLoading] = useState(false)
  const history = useHistory()

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      let roles = JSON.parse(sessionStorage.getItem('roles'))
      if (roles.includes('manager')) {
        window.location.assign(`${process.env.REACT_APP_URL}/customers`)
      } else if (roles.includes('salesperson')) {
        window.location.assign(`${process.env.REACT_APP_URL}/customers/search`)
      } else {
        window.location.assign(`${process.env.REACT_APP_URL}/profile`)
      }
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    let loginResponse = {}
    loginResponse = await login(
      loginCredsEmail,
      loginCredsPassword
    ).catch(() => {})
    if (!loginResponse?.is_success) {
      alert('Login Failed')
    } else {
      sessionStorage.setItem('email', loginResponse.data.user.email)
      sessionStorage.setItem(
        'roles',
        JSON.stringify(loginResponse.data.user.roles)
      )
      sessionStorage.setItem(
        'token',
        loginResponse.data.user.authentication_token
      )
      setLoggedIn(true)

      let roles = loginResponse.data.user.roles
      if (roles.includes('manager')) {
        window.location.href = `${process.env.REACT_APP_URL}/customers`
      } else if (roles.includes('salesperson')) {
        window.location.assign(`${process.env.REACT_APP_URL}/customers/search`)
      } else {
        window.location.assign(`${process.env.REACT_APP_URL}/profile`)
      }

      // history.push('/')
    }
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('token')
  }

  return (
    <div className="w-50 mx-auto">
      <div className="my-2 form text-8">
        {isLoading ? (
          <h2>Please wait, loading</h2>
        ) : isLoggedIn ? (
          <h2>You are logged in</h2>
        ) : (
          <h2>Please log in</h2>
        )}
      </div>
      <div className="text-8">
        <label>Username</label>
        <input
          className="form-control text-9 bg-3 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
          type="text"
          onChange={(e) => setLoginCredsEmail(e.target.value, 'email')}
        />
        <label>Password</label>
        <input
          className="form-control text-9 bg-3 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
          type="password"
          onChange={(e) => setLoginCredsPassword(e.target.value, 'password')}
        />
      </div>

      <div className="mt-2 mb-5 d-flex justify-content-between">
        <button className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
