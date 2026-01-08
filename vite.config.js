import { defineConfig } from 'vite'

export default defineConfig({
  base: '/os/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
  }
})
