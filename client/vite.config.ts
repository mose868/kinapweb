import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime')
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
  optimizeDeps: {
    include: ['@babel/runtime/helpers/esm/assertThisInitialized', '@babel/runtime/helpers/esm/inherits']
  }
}) 