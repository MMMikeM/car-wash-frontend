import React from 'react'
import { createRoot } from 'react-dom/client'
import { SWRConfig } from 'swr'
import './index.css'
import App from './App'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        // ky already retries idempotent requests twice; SWR retrying on top
        // of that multiplies a failing call into a dozen.
        suspense: true,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>
)
