import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/kpay': {
        target: 'https://admin.kpay.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kpay/, ''),
      },
    },
  },
  resolve : {
    alias : [
      {
        find : '@',
        replacement : path.resolve(__dirname, "./src")
      },
      {
        find : '@components',
        replacement : path.resolve(__dirname, "./src/components")
      },
      {
        find : '@assets',
        replacement : path.resolve(__dirname, "./src/assets")
      },     
      {
        find : '@layouts',
        replacement : path.resolve(__dirname, "./src/layouts")
      },   
      {
        find : '@local',
        replacement : path.resolve(__dirname, "./src/local")
      },    
      {
        find : '@private',
        replacement : path.resolve(__dirname, "./src/private")
      },     
      {
        find : '@auth',
        replacement : path.resolve(__dirname, "./src/auth")
      },                       
      {
        find : '@context',
        replacement : path.resolve(__dirname, "./src/context")
      },
      {
        find : '@services',
        replacement : path.resolve(__dirname, "./src/services")
      },
      {
        find : '@hooks',
        replacement : path.resolve(__dirname, "./src/hooks")
      },
      {
        find : '@utils',
        replacement : path.resolve(__dirname, "./src/utils")
      },
      {
        find : '@store',
        replacement : path.resolve(__dirname, "./src/store")
      }             
    ]
  }
})
