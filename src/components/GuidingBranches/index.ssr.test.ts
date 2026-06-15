// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { GuidingBranches } from './index'

describe('GuidingBranches en SSR (sin document)', () => {
  it('renderiza el contenedor y el canvas sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(createElement(GuidingBranches, { color: '#34d399' }))
    expect(html).toContain('aui-guiding-branches')
    expect(html).toContain('<canvas')
  })

  it('materializa los parámetros como CSS vars inline en el root', () => {
    const html = renderToString(createElement(GuidingBranches, { color: '#34d399', maxDistance: 300 }))
    expect(html).toContain('--aui-branches-color:#34d399')
    expect(html).toContain('--aui-branches-max-distance:300')
  })

  it('renderiza children (el target sigue clickeable: overlay pointer-events:none)', () => {
    const html = renderToString(
      createElement(GuidingBranches, { children: createElement('button', null, 'Ir') }),
    )
    expect(html).toContain('aui-branches-content')
    expect(html).toContain('<button')
    expect(html).toContain('Ir')
  })
})
