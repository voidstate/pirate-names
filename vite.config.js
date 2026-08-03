import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const repoName = process.env.GITHUB_REPOSITORY?.split( '/' )[ 1 ] || 'pirate-names'

// https://vite.dev/config/
export default defineConfig( {
  base: process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath( new URL( './src', import.meta.url ) )
    },
  },
} )
