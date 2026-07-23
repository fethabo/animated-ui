// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { useTilt } from './use-tilt'

function HookConsumer() {
  const ref = useTilt({ maxAngle: 10 })
  return createElement('section', { ref, className: 'mi-card' }, 'Contenido')
}

describe('useTilt en SSR (sin document)', () => {
  it('un componente que usa el hook renderiza sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(HookConsumer))
    expect(html).toContain('mi-card')
    expect(html).toContain('Contenido')
  })
})
