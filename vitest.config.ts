import { defineConfig } from 'vitest/config'

export default defineConfig({
  // El runtime JSX sale del tsconfig (`jsx: react-jsx`), que Vite/rolldown
  // respetan para los tests que montan componentes.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
