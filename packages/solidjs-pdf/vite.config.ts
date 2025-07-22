import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [solid(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'solidjs-pdf',
      formats: ['es', 'umd'],
      fileName: (format) => `solidjs-pdf.${format}.js`,
    },
    rollupOptions: {
      external: ['solid-js'],
    },
  },
})
