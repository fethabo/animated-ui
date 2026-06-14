import { describe, expect, it } from 'vitest'
import { lava } from './lava'

describe('variante lava', () => {
  it('se identifica como "lava" y apunta a la clase aui-lava', () => {
    expect(lava.name).toBe('lava')
    expect(lava.css).toContain('.aui-lava')
  })

  it('usa el truco gooey: blobs circulares opacos sobre fondo opaco + blur + contrast', () => {
    expect(lava.css).toContain('background-color: var(--aui-lava-base')
    // `circle closest-side` sobre tiles cuadrados → círculos reales, no elipses.
    expect(lava.css).toContain('radial-gradient(circle closest-side, var(--aui-lava-color-1')
    expect(lava.css).toContain('filter: blur(var(--aui-lava-blur, 16px)) contrast(var(--aui-lava-contrast, 16))')
  })

  it('anima la posición de los blobs (ascenso/descenso)', () => {
    expect(lava.css).toContain('animation: aui-lava-rise var(--aui-lava-speed, 16s)')
    expect(lava.css).toContain('@keyframes aui-lava-rise')
  })

  it('define una composición estática bajo reduced motion', () => {
    expect(lava.css).toContain('.aui-bg[data-aui-static].aui-lava')
  })

  it('mapea colors/speed/intensity a sus CSS custom properties', () => {
    expect(lava.cssVars({ colors: ['#ff6b6b', '#f59e0b'] })).toEqual({
      '--aui-lava-color-1': '#ff6b6b',
      '--aui-lava-color-2': '#f59e0b',
    })
    expect(lava.cssVars({ speed: 20, intensity: 0.8 })).toEqual({
      '--aui-lava-speed': '20s',
      '--aui-lava-opacity': '0.8',
    })
  })

  it('sin props no setea ninguna var (los defaults viven en el CSS)', () => {
    expect(lava.cssVars({})).toEqual({})
  })
})
