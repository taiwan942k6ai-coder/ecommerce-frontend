// 一開始的react專案
// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// 加入Tailwind和shadcn/ui
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite' // 1. 引入 Tailwind 插件
// import path from "path"

// // https://vite.dev
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(), // 2. 把它加進 plugins 陣列中
//   ],
//     resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })


//改成ESM (ECMAScript Modules) 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url' // 1. 改引入這個現代的 URL 工具

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // 2. 用這個方式來代替舊的 path.resolve(__dirname, "./src")
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
    server: {
    host: true, // 相當於 --host，對所有專案成員、手機開放連線
    port: 5173, // 預設使用 5173
  }
})