import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin do Tailwind CSS v4 — integrado diretamente no Vite,
    // sem necessidade de arquivo tailwind.config.js separado
    tailwindcss(),
  ],
})
