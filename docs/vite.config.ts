import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La docs consume el paquete buildeado (file:..) igual que test-app: lo que se
// ve en la web es lo que recibe un consumer npm, no el src de la librería.
export default defineConfig({
  // base: '/' para un subdominio dedicado (docs.tudominio.com). Si la web se
  // sirve desde una subcarpeta (tudominio.com/docs/), setear DOCS_BASE=/docs/.
  base: process.env.DOCS_BASE ?? '/',
  plugins: [react()],
  // fs.allow: los ejemplos standalone se importan con ?raw desde ../examples.
  server: { fs: { allow: ['..'] } },
})
