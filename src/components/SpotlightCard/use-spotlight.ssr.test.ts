// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { useSpotlight } from './use-spotlight'

function HookConsumer() {
  const ref = useSpotlight({ radius: 300 })
  return createElement('article', { ref, className: 'mi-card' }, 'Contenido')
}

describe('useSpotlight en SSR (sin document)', () => {
  it('un componente que usa el hook renderiza sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(HookConsumer))
    expect(html).toContain('mi-card')
    expect(html).toContain('Contenido')
  })
})
