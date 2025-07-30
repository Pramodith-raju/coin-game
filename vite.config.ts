import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/game-over/', // 👈 Add this line
  plugins: [react()]
})

