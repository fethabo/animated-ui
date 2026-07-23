// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { useGlowBorder } from './use-glow-border'

function HookConsumer() {
  const ref = useGlowBorder({ speed: 6, followCursor: true })
  return createElement('div', { ref, className: 'mi-contenedor' }, 'Contenido')
}

describe('useGlowBorder en SSR (sin document)', () => {
  it('un componente que usa el hook renderiza sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(HookConsumer))
    expect(html).toContain('mi-contenedor')
    expect(html).toContain('Contenido')
  })
})
