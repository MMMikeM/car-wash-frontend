import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // Vendor code is ~85% of the bundle and changes rarely. Splitting it
        // out means shipping app changes stops invalidating React in everyone's
        // cache.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Left unassigned so they follow the lazy route that imports them
          // into its own chunk rather than being pinned into vendor.
          if (/react-movable|react-circular-progressbar/.test(id)) return
          if (/[\\/]react(-dom|-is)?[\\/]|[\\/]scheduler[\\/]/.test(id)) {
            return 'react'
          }
          return 'vendor'
        },
      },
    },
  },
  // Support CRA-style env vars (REACT_APP_ prefix)
  envPrefix: ['VITE_', 'REACT_APP_'],
})
