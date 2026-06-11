// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ScrambleText } from './index'

describe('ScrambleText en SSR (sin document)', () => {
  it('renderiza sin errores y produce el texto final estático', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(ScrambleText, { text: 'hola mundo' }))
    expect(html).toContain('hola mundo')
  })

  it('expone aria-label con el texto final y oculta el span mutante', () => {
    const html = renderToString(createElement(ScrambleText, { text: 'descifrado' }))
    expect(html).toContain('aria-label="descifrado"')
    expect(html).toContain('aria-hidden="true"')
  })

  it('materializa scrambleColor como --aui-scramble-color inline', () => {
    const html = renderToString(createElement(ScrambleText, { text: 'x', scrambleColor: '#22d3ee' }))
    expect(html).toContain('--aui-scramble-color:#22d3ee')
  })
})
