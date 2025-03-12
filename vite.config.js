import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',    // 静态资源目录（图片/CSS/JS等）
  build: {
    outDir: 'dist',       // 构建输出目录（HTML等）
    emptyOutDir: true     // 构建前清空目录
  },
  plugins: [react(), tsconfigPaths(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
    manifest: false, // 使用public/manifest.json
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/app\.miaogu\.top\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'miaogu-api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
            }
          }
        }
      ]
    }
  })],
  server: {
    port: 5174, // 设置端口为 5174
    host: '0.0.0.0', // 允许局域网访问
    allowedHosts: [
      'boa-awake-finch.ngrok-free.app', // 添加你的 ngrok 域名
      // 可以添加多个允许的域名
    ]
  }
})
