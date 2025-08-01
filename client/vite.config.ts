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
    port: 3000,
    host: true,
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
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  define: {
    // Disable React StrictMode in production to prevent double rendering
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
}) 