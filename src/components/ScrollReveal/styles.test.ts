import { describe, expect, it } from 'vitest'
import { revealCss, revealVars } from './styles'

describe('revealCss', () => {
  const css = revealCss()

  it('los items parten ocultos y transicionan opacity y translate', () => {
    expect(css).toContain('.aui-reveal > .aui-reveal-item')
    expect(css).toContain('opacity: 0')
    expect(css).toMatch(/transition:\s*\n?\s*opacity var\(--aui-reveal-duration, 0\.6s\)/)
    expect(css).toContain('translate var(--aui-reveal-duration, 0.6s)')
  })

  it('cada dirección define su desplazamiento inicial con la distancia como var', () => {
    expect(css).toContain('[data-aui-dir="up"] > .aui-reveal-item')
    expect(css).toContain('translate: 0 var(--aui-reveal-distance, 24px)')
    expect(css).toContain('[data-aui-dir="down"] > .aui-reveal-item')
    expect(css).toContain('translate: 0 calc(-1 * var(--aui-reveal-distance, 24px))')
    expect(css).toContain('[data-aui-dir="left"] > .aui-reveal-item')
    expect(css).toContain('translate: var(--aui-reveal-distance, 24px) 0')
    expect(css).toContain('[data-aui-dir="right"] > .aui-reveal-item')
    expect(css).toContain('translate: calc(-1 * var(--aui-reveal-distance, 24px)) 0')
  })

  it('direction none deja los items sin desplazamiento (solo fade)', () => {
    expect(css).toContain('[data-aui-dir="none"] > .aui-reveal-item')
    expect(css).toMatch(/\[data-aui-dir="none"\] > \.aui-reveal-item \{\n {2}translate: 0 0;/)
  })

  it('el stagger es delay incremental por índice de item', () => {
    expect(css).toContain('transition-delay: calc(var(--aui-reveal-stagger, 0.1s) * var(--aui-reveal-i, 0))')
  })

  it('data-aui-visible lleva los items a su estado final', () => {
    expect(css).toContain('[data-aui-visible] > .aui-reveal-item')
    expect(css).toContain('opacity: 1')
  })

  it('data-aui-static (reduced motion) muestra visible sin transición', () => {
    expect(css).toContain('[data-aui-static] > .aui-reveal-item')
    expect(css).toContain('transition: none')
  })
})

describe('revealVars', () => {
  it('sin props explícitas no setea ninguna var (los defaults viven en el CSS)', () => {
    expect(revealVars({})).toEqual({})
  })

  it('materializa cada prop con su unidad', () => {
    expect(revealVars({ distance: 40, duration: 1.2, stagger: 0.25 })).toEqual({
      '--aui-reveal-distance': '40px',
      '--aui-reveal-duration': '1.2s',
      '--aui-reveal-stagger': '0.25s',
    })
  })
})
