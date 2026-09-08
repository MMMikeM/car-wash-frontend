import React from 'react'
import { createRoot } from 'react-dom/client'
import { SWRConfig } from 'swr'
import './index.css'
import App from './App'
import { reportError } from '@/lib/reportError'

const noun = (key: unknown): string =>
  Array.isArray(key) ? String(key[0]) : String(key)

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        // ky already retries idempotent requests twice; SWR retrying on top
        // of that multiplies a failing call into a dozen.
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        onError: (error, key) => reportError(error, `load ${noun(key)}`),
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>
)
