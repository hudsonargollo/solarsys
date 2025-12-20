/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2018', // More compatible target
    minify: 'esbuild',
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]'
      }
    },
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  }
})
