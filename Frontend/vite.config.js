import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://hrms-lite-backend-0122.onrender.com',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})