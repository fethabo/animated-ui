// Verificación 9.3: renderiza cada componente con renderToString y confirma
// que no lanza errores de `document`/`window` en SSR.
// Requiere haber corrido `npm install` y `npm run build` antes.
//   node scripts/ssr-check.mjs
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { AnimatedBackground, PixelBackground, TiltCard } from '../dist/index.js'

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
