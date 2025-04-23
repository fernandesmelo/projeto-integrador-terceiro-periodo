import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
       registerType: 'autoUpdate',
       includeAssets: ['/src/assets/logo.png'], // ícones e imagens
       manifest: {
         name: 'Dentalysis',
         short_name: 'Dentalysis',
         description:
             'Web app de gestão de casos odonto legal',
         theme_color: '#ffffff',
         icons: [
             {
               src: '/src/assets/logo.svg',
               sizes: 'any', // estou usando svg, então serve para qualquer tamanho
               type: 'image/svg+xml',
               purpose: 'any maskable',
             },
         ],
         }, 
    }),
  ],
})
