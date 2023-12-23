import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    }
  },
  plugins: [react(), viteCommonjs()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTest.js',
  },
})
