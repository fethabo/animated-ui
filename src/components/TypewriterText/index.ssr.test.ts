// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { TypewriterText } from './index'

describe('TypewriterText en SSR (sin document)', () => {
  it('renderiza sin errores y produce el primer string estático', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(TypewriterText, { text: 'hola mundo' }))
    expect(html).toContain('hola mundo')
  })

  it('expone aria-label con el texto y oculta el span mutante', () => {
    const html = renderToString(createElement(TypewriterText, { text: 'escribiendo' }))
    expect(html).toContain('aria-label="escribiendo"')
    expect(html).toContain('aria-hidden="true"')
  })

  it('con arreglo, el aria-label lista los strings y muestra el primero', () => {
    const html = renderToString(
      createElement(TypewriterText, { text: ['Diseño', 'Código', 'Arte'], loop: true }),
    )
    expect(html).toContain('aria-label="Diseño, Código, Arte"')
    expect(html).toContain('Diseño')
  })

  it('renderiza el cursor por default y permite un glifo custom', () => {
    expect(renderToString(createElement(TypewriterText, { text: 'x' }))).toContain(
      'aui-typewriter-cursor',
    )
    expect(renderToString(createElement(TypewriterText, { text: 'x', cursor: '_' }))).toContain(
      '_',
    )
  })

  it('con cursor={false} no renderiza cursor', () => {
    const html = renderToString(createElement(TypewriterText, { text: 'x', cursor: false }))
    expect(html).not.toContain('aui-typewriter-cursor')
  })
})
