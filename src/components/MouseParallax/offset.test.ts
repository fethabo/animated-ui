import { describe, expect, it } from 'vitest'
import { parallaxOffset } from './offset'

const rect = { left: 100, top: 50, width: 400, height: 200 }

describe('parallaxOffset', () => {
  it('cursor en el centro → 0,0', () => {
    expect(parallaxOffset(rect, 300, 150)).toEqual({ x: 0, y: 0 })
  })

  it('bordes → ±1 en cada eje', () => {
    expect(parallaxOffset(rect, 100, 50)).toEqual({ x: -1, y: -1 })
    expect(parallaxOffset(rect, 500, 250)).toEqual({ x: 1, y: 1 })
    expect(parallaxOffset(rect, 100, 250)).toEqual({ x: -1, y: 1 })
  })

  it('posiciones intermedias son proporcionales', () => {
    expect(parallaxOffset(rect, 400, 100)).toEqual({ x: 0.5, y: -0.5 })
  })

  it('fuera del rect se clampea a [-1, 1]', () => {
    expect(parallaxOffset(rect, 9999, -9999)).toEqual({ x: 1, y: -1 })
  })

  it('rect degenerado (sin tamaño) retorna 0,0 sin dividir por cero', () => {
    expect(parallaxOffset({ left: 0, top: 0, width: 0, height: 0 }, 10, 10)).toEqual({ x: 0, y: 0 })
  })
})
