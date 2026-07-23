// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { useMagnetic } from './use-magnetic'

function HookConsumer() {
  const ref = useMagnetic({ strength: 0.5 })
  return createElement('button', { ref, className: 'mi-boton' }, 'Acción')
}

describe('useMagnetic en SSR (sin document)', () => {
  it('un componente que usa el hook renderiza sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(HookConsumer))
    expect(html).toContain('mi-boton')
    expect(html).toContain('Acción')
  })
})
