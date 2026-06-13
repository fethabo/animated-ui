// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StickyScenes } from './index'

describe('StickyScenes en SSR (sin document)', () => {
  it('renderiza el contenedor y las escenas sin errores', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(
      createElement(
        StickyScenes,
        null,
        createElement(StickyScenes.Scene, null, 'Escena uno'),
        createElement(StickyScenes.Scene, null, 'Escena dos'),
        createElement(StickyScenes.Scene, null, 'Escena tres'),
      ),
    )
    expect(html).toContain('Escena uno')
    expect(html).toContain('Escena dos')
    expect(html).toContain('Escena tres')
    expect(html.match(/aui-sticky-scene"/g)).toHaveLength(3)
  })

  it('calcula la altura total como 100dvh + nScenes × sceneDuration', () => {
    const html = renderToString(
      createElement(
        StickyScenes,
        { sceneDuration: 1000 },
        createElement(StickyScenes.Scene, null, 'A'),
        createElement(StickyScenes.Scene, null, 'B'),
      ),
    )
    // 2 escenas × 1000px
    expect(html).toContain('calc(100dvh + 2000px)')
  })
})
