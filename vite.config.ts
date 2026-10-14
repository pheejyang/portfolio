import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` keeps /hero.jpg, /cv.pdf and /gallery/* working on any static host.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
