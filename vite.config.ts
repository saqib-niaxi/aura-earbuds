import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js lives in its own lazy chunk (~240 kB gzipped) that loads after first paint.
    chunkSizeWarningLimit: 1000,
  },
})
