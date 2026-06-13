// Verificación 7.3: bundlea un entry que solo importa TiltCard desde el
// barrel y confirma que el output no incluye código de AnimatedBackground
// ni PixelBackground.
// Requiere haber corrido `npm install` y `npm run build` antes.
//   node scripts/treeshake-check.mjs
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { build } from 'esbuild'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const result = await build({
  stdin: {
    contents: "export { TiltCard } from './dist/index.js'",
    resolveDir: root,
    sourcefile: 'treeshake-entry.js',
  },
  bundle: true,
  format: 'esm',
  minify: true,
  write: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
})

const code = result.outputFiles[0].text

// Marcadores que sobreviven a la minificación (string literals / property names).
const mustNotContain = [
  ['aui-aurora-drift', 'AnimatedBackground (keyframes aurora)'],
  ['aui-mesh-morph', 'AnimatedBackground (keyframes mesh)'],
  ['feTurbulence', 'AnimatedBackground (variante noise)'],
  ['aui-beam-spin', 'AnimatedBackground (keyframes beam)'],
  ['getContext', 'PixelBackground (canvas renderer)'],
  ['--aui-spotlight-x', 'SpotlightCard (CSS del overlay)'],
  ['aui-glow-spin', 'GlowBorder (keyframes del loop)'],
  ['--aui-particle-color', 'ParticleField (CSS var de partículas)'],
  ['aui-image-dissolve', 'ImageDissolve (clase del wrapper)'],
  ['--aui-scene-progress', 'StickyScenes (CSS var de progreso)'],
]
const mustContain = [['--aui-tilt-perspective', 'TiltCard']]

let failed = 0
for (const [marker, owner] of mustNotContain) {
  if (code.includes(marker)) {
    failed++
    console.error(`✗ el bundle incluye "${marker}" → se filtró código de ${owner}`)
  } else {
    console.log(`✓ sin rastros de ${owner}`)
  }
}
for (const [marker, owner] of mustContain) {
  if (!code.includes(marker)) {
    failed++
    console.error(`✗ el bundle NO incluye "${marker}" → falta el código de ${owner}`)
  } else {
    console.log(`✓ ${owner} presente en el bundle`)
  }
}

console.log(`\nTamaño del bundle (solo TiltCard, minificado): ${(code.length / 1024).toFixed(1)} kB`)
process.exit(failed > 0 ? 1 : 0)
