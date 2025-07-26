import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig({
  plugins: [preact(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'preact-pdf',
      formats: ['es', 'umd'],
      fileName: (format) => `preact-pdf.${format}.js`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.peerDependencies),
        ...Object.keys(pkg.dependencies),
      ],
    },
  },
})
