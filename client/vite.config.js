import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Pozwala na dostęp z zewnętrznych urządzeń
    port: 5173,       // Upewnij się, że port nie jest zablokowany
  },
})
