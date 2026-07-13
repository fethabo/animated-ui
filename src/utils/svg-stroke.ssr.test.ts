// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { svgStrokeCss, SVG_STROKE_STYLE_ID } from './svg-stroke'

describe('svg-stroke en SSR (sin document)', () => {
  it('el módulo se importa y genera CSS sin acceder al DOM', () => {
    expect(typeof document).toBe('undefined')
    expect(svgStrokeCss()).toContain('@keyframes aui-stroke-draw')
    expect(SVG_STROKE_STYLE_ID).toBe('aui-svg-stroke-styles')
  })

  it('el estado enrollado vive en la clase .aui-stroke: sin ella (markup SSR) el trazo queda completo y visible', () => {
    // El CSS solo oculta trazos con la clase `.aui-stroke`, que agrega
    // `prepareStroke` en el cliente: el markup servido no la tiene, así que
    // los paths se sirven completos (SEO/no-JS, design.md decisión 2).
    const css = svgStrokeCss()
    const dashRules = css.split('}').filter((rule) => rule.includes('stroke-dasharray'))
    expect(dashRules.length).toBeGreaterThan(0)
    for (const rule of dashRules) {
      expect(rule).toContain('.aui-stroke')
    }
  })
})
