import { describe, expect, it } from 'vitest'
import { pointerAngle, unwrapAngle } from './geometry'

describe('pointerAngle', () => {
  // El conic-gradient arranca arriba (12 en punto); el ángulo retornado
  // rota ese inicio hacia el cursor.
  it('cursor directamente arriba del centro → 0°', () => {
    expect(pointerAngle(100, 100, 100, 0)).toBeCloseTo(0)
  })

  it('cursor a la derecha del centro → 90°', () => {
    expect(pointerAngle(100, 100, 200, 100)).toBeCloseTo(90)
  })

  it('cursor directamente abajo del centro → 180°', () => {
    expect(pointerAngle(100, 100, 100, 200)).toBeCloseTo(180)
  })

  it('cursor a la izquierda del centro → 270° (equivalente a -90°)', () => {
    // atan2 retorna en (-180°, 180°]; +90 deja el rango en (-90°, 270°].
    expect(pointerAngle(100, 100, 0, 100)).toBeCloseTo(270)
  })

  it('diagonales intermedias', () => {
    expect(pointerAngle(0, 0, 100, 100)).toBeCloseTo(135)
    expect(pointerAngle(0, 0, -100, 100)).toBeCloseTo(225)
  })
})

describe('unwrapAngle', () => {
  it('sin cruce de discontinuidad, retorna next tal cual', () => {
    expect(unwrapAngle(10, 50)).toBe(50)
    expect(unwrapAngle(50, 10)).toBe(10)
  })

  it('cruzando +180/-180 toma el camino corto hacia adelante', () => {
    // De 170° a -170°: el camino corto es seguir hasta 190°, no volver 340°.
    expect(unwrapAngle(170, -170)).toBe(190)
  })

  it('cruzando -180/+180 toma el camino corto hacia atrás', () => {
    expect(unwrapAngle(-170, 170)).toBe(-190)
  })

  it('el resultado siempre queda a 180° o menos del ángulo previo', () => {
    const cases: Array<[number, number]> = [
      [0, 359],
      [720, -45],
      [-540, 180],
      [90, 270],
    ]
    for (const [previous, next] of cases) {
      const target = unwrapAngle(previous, next)
      expect(Math.abs(target - previous)).toBeLessThanOrEqual(180)
      // Equivalencia módulo 360 con el ángulo pedido.
      expect(((target - next) % 360 + 360) % 360).toBeCloseTo(0)
    }
  })
})
