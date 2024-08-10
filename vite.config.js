import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    //env variable from .env file
    'process.env.VITE_BASE_URL':JSON.stringify(process.env.VITE_BASE_URL)
  }
})
