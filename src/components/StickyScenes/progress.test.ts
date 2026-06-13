import { describe, expect, it } from 'vitest'
import { sceneAt, stickyProgress } from './progress'

describe('stickyProgress', () => {
  // Contenedor de 3000px, viewport de 1000px → 2000px scrolleables.
  it('top=0 → 0 (recién pegado al tope)', () => {
    expect(stickyProgress(0, 3000, 1000)).toBe(0)
  })

  it('top = -(containerHeight - viewportHeight) → 1 (final del recorrido)', () => {
    expect(stickyProgress(-2000, 3000, 1000)).toBe(1)
  })

  it('a mitad del recorrido → 0.5', () => {
    expect(stickyProgress(-1000, 3000, 1000)).toBe(0.5)
  })

  it('clampea fuera del rango', () => {
    expect(stickyProgress(500, 3000, 1000)).toBe(0)
    expect(stickyProgress(-9999, 3000, 1000)).toBe(1)
  })

  it('contenedor sin overflow → 0 (sin división por cero)', () => {
    expect(stickyProgress(0, 1000, 1000)).toBe(0)
    expect(stickyProgress(0, 500, 1000)).toBe(0)
  })
})

describe('sceneAt', () => {
  it('progreso 0 → primera escena, progreso 0', () => {
    expect(sceneAt(0, 3)).toEqual({ sceneIndex: 0, sceneProgress: 0 })
  })

  it('progreso 1 → última escena, progreso 1', () => {
    expect(sceneAt(1, 3)).toEqual({ sceneIndex: 2, sceneProgress: 1 })
  })

  it('límite exacto entre escenas → escena siguiente, progreso 0', () => {
    // Con 3 escenas, el límite escena 0→1 está en 1/3.
    expect(sceneAt(1 / 3, 3)).toEqual({ sceneIndex: 1, sceneProgress: 0 })
    expect(sceneAt(2 / 3, 3)).toEqual({ sceneIndex: 2, sceneProgress: 0 })
  })

  it('progreso a mitad de una escena', () => {
    // Mitad de la escena 1 (de 3): 1/3 + (1/6) = 0.5
    const { sceneIndex, sceneProgress } = sceneAt(0.5, 3)
    expect(sceneIndex).toBe(1)
    expect(sceneProgress).toBeCloseTo(0.5)
  })

  it('0 escenas → estado neutro sin dividir por cero', () => {
    expect(sceneAt(0.5, 0)).toEqual({ sceneIndex: 0, sceneProgress: 0 })
  })
})
