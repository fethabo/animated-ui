import { defineConfig } from 'tsup'

export default defineConfig({
  // Un entry por componente + barrel export: permite a los bundlers
  // resolver subpaths (`@fethabo/animated-ui/tilt-card`) y tree-shakear
  // el barrel sin arrastrar los demás componentes.
  entry: {
    index: 'src/index.ts',
    'animated-background': 'src/components/AnimatedBackground/index.tsx',
    'pixel-background': 'src/components/PixelBackground/index.tsx',
    'tilt-card': 'src/components/TiltCard/index.tsx',
    'spotlight-card': 'src/components/SpotlightCard/index.tsx',
    'glow-border': 'src/components/GlowBorder/index.tsx',
    'magnetic-element': 'src/components/MagneticElement/index.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  // tsconfig usa `jsx: preserve` (solo typecheck); esbuild necesita
  // emitir JS real, así que forzamos el runtime automático acá.
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
  // esbuild descarta las directivas 'use client' de los módulos al
  // bundlear; el banner las restituye para Next.js App Router.
  banner: {
    js: "'use client';",
  },
})
