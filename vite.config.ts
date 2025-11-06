import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { pwa } from './pwa'

export default defineConfig({
  plugins: [react(), pwa],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
})
