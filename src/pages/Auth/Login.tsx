import React, { useState, useEffect } from 'react'
import { login } from '../../services/authApi'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { LoginResponse } from '../../types'
import { toast } from '@/components/ui/toast'
import { isHTTPError } from 'ky'
import { reportError } from '@/lib/reportError'

const Login = () => {
  let [loginCredsEmail, setLoginCredsEmail] = useState('')
  let [loginCredsPassword, setLoginCredsPassword] = useState('')
  let [isLoggedIn, setLoggedIn] = useState(false)
  let [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      let roles = JSON.parse(sessionStorage.getItem('roles'))
      if (roles.includes('manager')) {
        window.location.assign(`${import.meta.env.REACT_APP_URL}/customers`)
      } else if (roles.includes('salesperson')) {
        window.location.assign(`${import.meta.env.REACT_APP_URL}/customers/search`)
      } else {
        window.location.assign(`${import.meta.env.REACT_APP_URL}/profile`)
      }
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    let loginResponse: LoginResponse | undefined
    try {
      loginResponse = await login(loginCredsEmail, loginCredsPassword)
    } catch (error) {
      // A 401 here means bad credentials; anything else is the server or the
      // connection, and saying "check your password" would be misleading.
      if (isHTTPError(error) && error.response.status === 401) {
        loginResponse = undefined
      } else {
        reportError(error, 'sign you in')
        setIsLoading(false)
        return
      }
    }

    if (!loginResponse?.is_success) {
      toast.error('Login failed', 'Check the contact number and password.')
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
        window.location.href = `${import.meta.env.REACT_APP_URL}/`
      } else if (roles.includes('salesperson')) {
        window.location.assign(`${import.meta.env.REACT_APP_URL}/`)
      } else {
        window.location.assign(`${import.meta.env.REACT_APP_URL}/`)
      }

    }
  }

  return (
    <div className="w-full mb-5 mx-1">
      <div className="max-xs mx-auto flex flex-col justify-center flex-wrap">
        <img
          alt="Company logo"
          src="/logo.png"
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
              <label htmlFor="contact_number">Contact Number</label>
              <input
                id="contact_number"
                className="block w-full px-3 py-1.5 leading-normal text-9 bg-3 border-0 text-6 mb-3 border-b rounded-none border-primary"
                type="text"
                onChange={(e) =>
                  setLoginCredsEmail(e.target.value)
                }
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="block w-full px-3 py-1.5 leading-normal text-9 bg-3 border-0 text-6 mb-3 border-b rounded-none border-primary"
                type="password"
                onChange={(e) =>
                  setLoginCredsPassword(e.target.value)
                }
              />
              <div className="flex justify-end mt-n1 mb-4">
                <Link to="/forgot_password">Forgot Password?</Link>
              </div>
            </div>

            <div className="mt-2 flex justify-between">
              <Button
                className="w-full my-3"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-3 px-4 pt-4 pb-3 border-primary border-t rounded-b">
          <div className="text-9 flex justify-center">
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
