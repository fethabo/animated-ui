import { describe, expect, it } from 'vitest'
import { spotlightVars } from './vars'
import { glowVars } from '../GlowBorder/vars'

describe('spotlightVars', () => {
  it('sin props no setea ninguna variable (los defaults viven en el CSS)', () => {
    expect(spotlightVars({})).toEqual({})
  })

  it('materializa solo las props provistas, con sus unidades', () => {
    expect(spotlightVars({ color: 'rgba(56,189,248,0.25)', radius: 300 })).toEqual({
      '--aui-spotlight-color': 'rgba(56,189,248,0.25)',
      '--aui-spotlight-radius': '300px',
    })
    expect(spotlightVars({ opacity: 0.6 })).toEqual({ '--aui-spotlight-opacity': '0.6' })
  })
})

describe('glowVars', () => {
  it('sin props no setea ninguna variable', () => {
    expect(glowVars({})).toEqual({})
  })

  it('materializa colores indexados y dimensiones con unidades', () => {
    expect(glowVars({ colors: ['#22d3ee', '#a78bfa'], speed: 3, width: 2, radius: 16, opacity: 0.8 })).toEqual({
      '--aui-glow-color-1': '#22d3ee',
      '--aui-glow-color-2': '#a78bfa',
      '--aui-glow-speed': '3s',
      '--aui-glow-width': '2px',
      '--aui-glow-radius': '16px',
      '--aui-glow-opacity': '0.8',
    })
  })

  it('descarta colores más allá del tercero', () => {
    const vars = glowVars({ colors: ['#1', '#2', '#3', '#4'] })
    expect(vars['--aui-glow-color-3']).toBe('#3')
    expect(vars['--aui-glow-color-4']).toBeUndefined()
  })
})
