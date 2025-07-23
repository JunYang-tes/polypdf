import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'VuePdf',
      fileName: 'vue-pdf',
    },
    rollupOptions: {
      external: ['vue', ...Object.keys(pkg.dependencies || {})],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
