// mobile-optimized
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Chunk splitting — faster mobile load
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Smaller chunks
    chunkSizeWarningLimit: 500,
    // CSS code split
    cssCodeSplit: true,
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // console.log remove in production
        drop_debugger: true,
      },
    },
    // Source maps off in production
    sourcemap: false,
  },
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
