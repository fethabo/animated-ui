import { describe, expect, it } from 'vitest'
import { splitRevealCss, splitVars } from './styles'

describe('splitRevealCss', () => {
  const css = splitRevealCss()

  it('las unidades parten ocultas y transicionan opacity, translate y filter', () => {
    expect(css).toContain('.aui-split-unit')
    expect(css).toContain('opacity: 0')
    expect(css).toMatch(/transition:\s*\n?\s*opacity var\(--aui-split-duration, 0\.6s\)/)
    expect(css).toContain('translate var(--aui-split-duration, 0.6s)')
    expect(css).toContain('filter var(--aui-split-duration, 0.6s)')
  })

  it('preserva el espaciado de las unidades con white-space: pre', () => {
    expect(css).toContain('white-space: pre')
  })

  it('el stagger es delay incremental por índice de unidad', () => {
    expect(css).toContain('transition-delay: calc(var(--aui-split-stagger, 0.05s) * var(--aui-split-i, 0))')
  })

  it('slide-up parte desplazado y blur parte desenfocado', () => {
    expect(css).toContain('[data-aui-preset="slide-up"] .aui-split-unit')
    expect(css).toContain('translate: 0 var(--aui-split-distance, 16px)')
    expect(css).toContain('[data-aui-preset="blur"] .aui-split-unit')
    expect(css).toContain('filter: blur(var(--aui-split-blur, 8px))')
  })

  it('data-aui-visible lleva las unidades a su estado final', () => {
    expect(css).toContain('[data-aui-visible] .aui-split-unit')
    expect(css).toContain('opacity: 1')
    expect(css).toContain('filter: blur(0)')
  })

  it('data-aui-static (reduced motion) muestra visible sin transición', () => {
    expect(css).toContain('[data-aui-static] .aui-split-unit')
    expect(css).toContain('transition: none')
  })
})

describe('splitVars', () => {
  it('sin props explícitas no setea ninguna var (los defaults viven en el CSS)', () => {
    expect(splitVars({})).toEqual({})
  })

  it('materializa cada prop con su unidad', () => {
    expect(splitVars({ stagger: 0.1, duration: 0.8, distance: 40 })).toEqual({
      '--aui-split-stagger': '0.1s',
      '--aui-split-duration': '0.8s',
      '--aui-split-distance': '40px',
    })
  })
})
