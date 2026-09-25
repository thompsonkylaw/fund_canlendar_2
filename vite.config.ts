// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
const pad = (n) => n.toString().padStart(2, '0');
const now = new Date();
const timestamp = [
  now.getFullYear(),
  pad(now.getMonth() + 1),
  pad(now.getDate()),
].join('-') + '-' + [
  pad(now.getHours()),
  pad(now.getMinutes()),
  pad(now.getSeconds()),
].join('');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        format: 'umd', // or 'iife'
        name: 'MyApp', // Required for UMD/IIFE; give your app a global name
        entryFileNames: `assets/index-${timestamp}.js`,
        chunkFileNames: `assets/[name]-${timestamp}.js`,
        assetFileNames: `assets/[name]-${timestamp}.[ext]`,
      },
    },
  },
})