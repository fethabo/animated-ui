import { describe, expect, it } from 'vitest'
import { grid } from './grid'
import { rays } from './rays'
import { dots } from './dots'

describe('variante grid', () => {
  it('se identifica como "grid" y apunta a la clase aui-grid', () => {
    expect(grid.name).toBe('grid')
    expect(grid.css).toContain('.aui-grid')
  })

  it('construye la grilla en perspectiva con gradientes repetidos', () => {
    expect(grid.css).toContain('repeating-linear-gradient')
    expect(grid.css).toContain('perspective(')
    expect(grid.css).toContain('rotateX(')
  })

  it('anima el desplazamiento hacia el horizonte por un período de celda exacto (loop sin salto)', () => {
    expect(grid.css).toContain('animation: aui-grid-move var(--aui-grid-speed, 8s) linear infinite')
    expect(grid.css).toContain('@keyframes aui-grid-move')
    expect(grid.css).toContain('background-position:')
    expect(grid.css).toContain('var(--aui-grid-cell, 48px)')
  })

  it('mapea colors/speed/intensity a sus CSS custom properties', () => {
    expect(grid.cssVars({ colors: ['#22d3ee', '#0f172a', '#ec4899'] })).toEqual({
      '--aui-grid-line': '#22d3ee',
      '--aui-grid-base': '#0f172a',
      '--aui-grid-glow': '#ec4899',
    })
    expect(grid.cssVars({ speed: 12, intensity: 0.7 })).toEqual({
      '--aui-grid-speed': '12s',
      '--aui-grid-opacity': '0.7',
    })
  })

  it('sin props no setea ninguna var (los defaults viven en el CSS)', () => {
    expect(grid.cssVars({})).toEqual({})
  })
})

describe('variante rays', () => {
  it('se identifica como "rays" y apunta a la clase aui-rays', () => {
    expect(rays.name).toBe('rays')
    expect(rays.css).toContain('.aui-rays')
  })

  it('los haces salen de un vértice con un conic-gradient y rotan desde ahí', () => {
    expect(rays.css).toContain('conic-gradient')
    expect(rays.css).toContain('at 50% 0%')
    expect(rays.css).toContain('transform-origin: 50% 0')
  })

  it('rota lentamente en vaivén (alternate)', () => {
    expect(rays.css).toContain('animation: aui-rays-sway var(--aui-rays-speed, 18s) ease-in-out infinite alternate')
    expect(rays.css).toContain('@keyframes aui-rays-sway')
  })

  it('mapea colors/speed/intensity a sus CSS custom properties', () => {
    expect(rays.cssVars({ colors: ['#fbbf24', '#f97316', '#ec4899', '#0b1120'] })).toEqual({
      '--aui-rays-color-1': '#fbbf24',
      '--aui-rays-color-2': '#f97316',
      '--aui-rays-color-3': '#ec4899',
      '--aui-rays-base': '#0b1120',
    })
    expect(rays.cssVars({ speed: 30, intensity: 0.5 })).toEqual({
      '--aui-rays-speed': '30s',
      '--aui-rays-opacity': '0.5',
    })
  })

  it('sin props no setea ninguna var', () => {
    expect(rays.cssVars({})).toEqual({})
  })
})

describe('variante dots', () => {
  it('se identifica como "dots" y apunta a la clase aui-dots', () => {
    expect(dots.name).toBe('dots')
    expect(dots.css).toContain('.aui-dots')
  })

  it('construye la retícula con radial-gradient repetido por background-size', () => {
    expect(dots.css).toContain('radial-gradient')
    expect(dots.css).toContain('background-size: var(--aui-dots-cell, 28px) var(--aui-dots-cell, 28px)')
  })

  it('pulsa opacidad y escala en loop', () => {
    expect(dots.css).toContain('animation: aui-dots-pulse var(--aui-dots-speed, 4s) ease-in-out infinite')
    expect(dots.css).toContain('@keyframes aui-dots-pulse')
    expect(dots.css).toContain('transform: scale(1.04)')
  })

  it('mapea colors/speed/intensity a sus CSS custom properties', () => {
    expect(dots.cssVars({ colors: ['#34d399', '#0f172a'] })).toEqual({
      '--aui-dots-color': '#34d399',
      '--aui-dots-base': '#0f172a',
    })
    expect(dots.cssVars({ speed: 6, intensity: 0.8 })).toEqual({
      '--aui-dots-speed': '6s',
      '--aui-dots-opacity': '0.8',
    })
  })

  it('sin props no setea ninguna var', () => {
    expect(dots.cssVars({})).toEqual({})
  })
})
