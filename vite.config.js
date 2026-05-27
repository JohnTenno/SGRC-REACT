import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  define: { global: 'globalThis' },
  plugins: [react(), tailwindcss(), basicSsl()],
  build: {
    outDir: '../SGRC-SPRING/src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    https: true,
    proxy: {
      '/api': { target: 'https://localhost:3000', changeOrigin: true, secure: false },
      '/ws': { target: 'wss://localhost:3000', changeOrigin: true, ws: true, secure: false },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
