import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0', // 允许局域网访问
    allowedHosts: [
      '11b3-112-54-13-173.ngrok-free.app', // 添加你的 ngrok 域名
      // 可以添加多个允许的域名
    ]
  }
})
