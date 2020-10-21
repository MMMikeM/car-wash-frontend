import React, { useState, useEffect } from 'react'
import { login } from '../../services/authApi'
import { useHistory, Link } from 'react-router-dom'

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
      setIsLoading(false)
    } else {
      sessionStorage.setItem('id', loginResponse.data.user.id)
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
        window.location.href = `${process.env.REACT_APP_URL}/`
      } else if (roles.includes('salesperson')) {
        window.location.assign(`${process.env.REACT_APP_URL}/`)
      } else {
        window.location.assign(`${process.env.REACT_APP_URL}/`)
      }

      // history.push('/')
    }
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('token')
  }

  return (
    <div className="w-100 mb-5 mx-1">
      <div className="max-xs mx-auto d-flex flex-column justify-content-center flex-wrap">
        <img
          alt="Company logo"
          src="public/logo.png"
          style={{ width: '200px' }}
          className="mx-auto mb-3 mt-3"
        />
        <div className="bg-3 px-4 pt-4 pb-3 mt-5">
          <div className="px-2">
            <div className="mb-3 form text-9 pt-1 pb-2">
              {isLoading ? (
                <h2>Please wait, loading</h2>
              ) : isLoggedIn ? (
                <h2>You are logged in</h2>
              ) : (
                <h2>Please log in</h2>
              )}
            </div>
            <div className="text-9">
              <label>Contact Number</label>
              <input
                className="form-control text-9 bg-3 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
                type="text"
                onChange={(e) =>
                  setLoginCredsEmail(e.target.value, 'contact_number')
                }
              />
              <label>Password</label>
              <input
                className="form-control text-9 bg-3 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
                type="password"
                onChange={(e) =>
                  setLoginCredsPassword(e.target.value, 'password')
                }
              />
              <div className="d-flex justify-content-end mt-n1 mb-4">
                <Link to="/forgot_password">Forgot Password?</Link>
              </div>
            </div>

            <div className="mt-2 d-flex justify-content-between">
              <button
                className="btn btn-primary w-100 my-3"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="bg-3 px-4 pt-4 pb-3 border-primary border-top rounded-bottom">
          <div className="text-9 d-flex justify-content-center  ">
            <h6>
              New to Carbon Car Wash?
              <Link className="pl-2" to="/sign_up">
                Sign Up
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
