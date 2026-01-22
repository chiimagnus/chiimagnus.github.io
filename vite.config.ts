import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    // 自定义插件：处理 /dice 路由重写
    {
      name: 'rewrite-dice-route',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          // 将 /dice 重写为 /dice.html
          if (req.url === '/dice' || req.url === '/dice/') {
            req.url = '/dice.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5500,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dice: resolve(__dirname, 'dice.html'),
      },
    },
  },
}) 