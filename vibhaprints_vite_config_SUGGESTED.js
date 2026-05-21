import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:    ["react", "react-dom", "react-router-dom"],
          seo:       ["react-helmet-async"],
        },
      },
    },
    // Optimize chunks
    chunkSizeWarningLimit: 600,
  },

  // Server config
  server: {
    port: 5173,
    open: true,
  },

  // Preview config (simulates production)
  preview: {
    port: 4173,
  },
});
