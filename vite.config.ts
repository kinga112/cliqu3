import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      process: "process/browser"
    }
  },
  define: {
    global: {}
  },
})
