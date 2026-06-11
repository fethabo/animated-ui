// Verificación 9.3: renderiza cada componente con renderToString y confirma
// que no lanza errores de `document`/`window` en SSR.
// Requiere haber corrido `npm install` y `npm run build` antes.
//   node scripts/ssr-check.mjs
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import {
  AnimatedBackground,
  GlowBorder,
  MagneticElement,
  PixelBackground,
  SpotlightCard,
  TiltCard,
} from '../dist/index.js'

const cases = [
  ['AnimatedBackground (aurora)', () => createElement(AnimatedBackground, { variant: 'aurora' })],
  ['AnimatedBackground (mesh)', () => createElement(AnimatedBackground, { variant: 'mesh' })],
  ['AnimatedBackground (noise)', () => createElement(AnimatedBackground, { variant: 'noise' })],
  ['AnimatedBackground (beam)', () => createElement(AnimatedBackground, { variant: 'beam' })],
  [
    'PixelBackground (hover+idle+reveal)',
    () => createElement(PixelBackground, { behaviors: ['hover', 'idle', 'reveal'] }),
  ],
  [
    'TiltCard (children estáticos)',
    () => createElement(TiltCard, { glare: true }, createElement('p', null, 'hola')),
  ],
  [
    'TiltCard (render prop)',
    () =>
      createElement(TiltCard, null, (state) =>
        createElement('p', null, `tilt: ${state.tiltX}, ${state.tiltY}`),
      ),
  ],
  [
    'SpotlightCard',
    () => createElement(SpotlightCard, { color: '#fff', radius: 300 }, createElement('p', null, 'hola')),
  ],
  [
    'GlowBorder (loop)',
    () => createElement(GlowBorder, { width: 2 }, createElement('p', null, 'hola')),
  ],
  [
    'GlowBorder (followCursor)',
    () => createElement(GlowBorder, { followCursor: true }, createElement('p', null, 'hola')),
  ],
  [
    'MagneticElement (children estáticos)',
    () => createElement(MagneticElement, { strength: 0.5 }, createElement('button', null, 'hola')),
  ],
  [
    'MagneticElement (render prop)',
    () =>
      createElement(MagneticElement, null, (state) =>
        createElement('p', null, `offset: ${state.offsetX}, ${state.offsetY}`),
      ),
  ],
]

let failed = 0
for (const [name, make] of cases) {
  try {
    const html = renderToString(make())
    console.log(`✓ ${name} — ${html.length} bytes de HTML`)
  } catch (error) {
    failed++
    console.error(`✗ ${name} — ${error.message}`)
  }
}

if (failed > 0) {
  console.error(`\n${failed} componente(s) fallaron en SSR`)
  process.exit(1)
}
console.log('\nSSR OK: ningún componente accede a document/window durante el render.')
