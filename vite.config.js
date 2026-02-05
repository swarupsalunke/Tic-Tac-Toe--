import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/',
      manifest: {
        name: 'Tic Tac Toe',
        short_name: 'TicTacToe',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#2196f3',
        background_color: '#000000',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })

  ]
})
