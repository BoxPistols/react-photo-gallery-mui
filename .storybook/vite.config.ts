import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  css: {
    postcss: './postcss.config.mjs',
  },
  build: {
    rollupOptions: {
      onLog(level, log, handler) {
        // Suppress "use client" directive warnings
        if (
          log.message?.includes(
            'Module level directives cause errors when bundled'
          )
        ) {
          return
        }
        handler(level, log)
      },
    },
  },
})
