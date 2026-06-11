import { defineConfig } from 'vitest/config'

export default defineConfig({
  // tsconfig usa `jsx: preserve` (solo typecheck); igual que en tsup, acá
  // esbuild necesita emitir JS real para los tests que montan componentes.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
