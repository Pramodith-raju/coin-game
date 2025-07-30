import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/coin-game/', // 👈 Add this line
  plugins: [react()]
})

