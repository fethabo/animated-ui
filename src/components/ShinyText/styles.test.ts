import { beforeEach, describe, expect, it } from 'vitest'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { shinyCss, shinyVars } from './styles'

describe('shinyCss', () => {
  const css = shinyCss()

  it('clipea el background al texto con prefijo -webkit- y estándar', () => {
    expect(css).toContain('-webkit-background-clip: text')
    expect(css).toMatch(/[^-]background-clip: text/)
    expect(css).toContain('color: transparent')
  })

  it('anima background-position con keyframes propios, solo bajo data-aui-loop', () => {
    expect(css).toContain('@keyframes aui-shiny-sweep')
    expect(css).toContain('.aui-shiny[data-aui-loop]')
    expect(css).toMatch(/from \{ background-position: 100% 0; \}/)
    expect(css).toMatch(/to \{ background-position: -100% 0; \}/)
  })

  it('incluye fallback @supports que restaura el color base (texto nunca invisible)', () => {
    expect(css).toContain('@supports not ((-webkit-background-clip: text) or (background-clip: text))')
    expect(css).toContain('color: var(--aui-shiny-color, #71717a)')
    expect(css).toContain('background-image: none')
  })

  it('todos los parámetros visuales tienen var() con fallback al default', () => {
    expect(css).toContain('var(--aui-shiny-color, #71717a)')
    expect(css).toContain('var(--aui-shiny-highlight, #fafafa)')
    expect(css).toContain('var(--aui-shiny-speed, 3s)')
    expect(css).toContain('var(--aui-shiny-angle, 120deg)')
  })

  it('el gradiente abre y cierra con el color base (tile sin costura)', () => {
    const stops = css.match(/var\(--aui-shiny-color, #71717a\) (\d+)%/g)
    expect(stops?.[0]).toContain('0%')
    expect(stops?.[stops.length - 1]).toContain('100%')
  })
})

describe('shinyVars', () => {
  it('sin props explícitas no setea ninguna var (los defaults viven en el CSS)', () => {
    expect(shinyVars({})).toEqual({})
  })

  it('materializa cada prop con su unidad', () => {
    expect(shinyVars({ color: '#222', highlight: 'gold', speed: 5, angle: 90 })).toEqual({
      '--aui-shiny-color': '#222',
      '--aui-shiny-highlight': 'gold',
      '--aui-shiny-speed': '5s',
      '--aui-shiny-angle': '90deg',
    })
  })
})

describe('inyección del CSS de ShinyText', () => {
  beforeEach(() => {
    document.getElementById(styleId('shiny-text'))?.remove()
  })

  it('se inyecta una sola vez aunque se llame múltiples veces (dedupe por id)', () => {
    injectStyles(styleId('shiny-text'), shinyCss())
    injectStyles(styleId('shiny-text'), shinyCss())
    const tags = document.querySelectorAll(`#${styleId('shiny-text')}`)
    expect(tags).toHaveLength(1)
    expect(tags[0].textContent).toContain('@keyframes aui-shiny-sweep')
  })
})
