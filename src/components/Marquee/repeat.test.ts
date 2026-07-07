import { describe, expect, it } from 'vitest'
import { cycleDuration, repeatCount } from './repeat'

describe('repeatCount', () => {
  it('contenido más ancho que el contenedor: una sola repetición', () => {
    expect(repeatCount(800, 600)).toBe(1)
    expect(repeatCount(600, 600)).toBe(1)
  })

  it('contenido angosto: repite hasta cubrir el contenedor', () => {
    expect(repeatCount(200, 600)).toBe(3)
    expect(repeatCount(250, 600)).toBe(3)
    expect(repeatCount(100, 1050)).toBe(11)
  })

  it('medidas degeneradas caen a 1', () => {
    expect(repeatCount(0, 600)).toBe(1)
    expect(repeatCount(-10, 600)).toBe(1)
    expect(repeatCount(200, 0)).toBe(1)
  })
})

describe('cycleDuration', () => {
  it('deriva la duración de la distancia del ciclo y la velocidad', () => {
    // 1 repetición de 300px + gap 20px a 80 px/s = 4s.
    expect(cycleDuration(300, 20, 1, 80)).toBe(4)
    // 3 repeticiones de 100px + gap 20px = 360px a 60 px/s = 6s.
    expect(cycleDuration(100, 20, 3, 60)).toBe(6)
  })

  it('parámetros degenerados retornan 0 (el CSS conserva su default)', () => {
    expect(cycleDuration(0, 20, 1, 60)).toBe(0)
    expect(cycleDuration(300, 20, 0, 60)).toBe(0)
    expect(cycleDuration(300, 20, 1, 0)).toBe(0)
  })
})
