import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'ai*jot',
                short_name: 'aijot',
                start_url: '/jot',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#ffffff',
                icons: [],
            },
        }),
    ],
})
