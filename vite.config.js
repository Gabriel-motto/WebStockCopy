import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  // Served from https://gabriel-motto.github.io/WebStockCopy/
  base: '/WebStockCopy/',
  plugins: [react(), tsconfigPaths()],
})
