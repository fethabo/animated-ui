import { describe, expect, it } from 'vitest'
import { handDrawnShapes, underline, type HandDrawnShapeName } from './hand-drawn'

const SHAPES = Object.keys(handDrawnShapes) as HandDrawnShapeName[]

/**
 * Valida la sintaxis del `d`: solo comandos absolutos M/L/Q/C con la aridad
 * correcta y números finitos. Devuelve los números encontrados.
 */
function parsePath(d: string): number[] {
  const tokens = d.trim().split(/[\s,]+/)
  const arity: Record<string, number> = { M: 2, L: 2, Q: 4, C: 6 }
  const numbers: number[] = []
  let i = 0
  expect(tokens[0]).toBe('M')
  while (i < tokens.length) {
    const command = tokens[i++]
    const count = arity[command]
    expect(count, `comando inválido: ${command}`).toBeDefined()
    for (let k = 0; k < count; k++) {
      const n = Number(tokens[i++])
      expect(Number.isFinite(n), `número inválido en ${d.slice(0, 40)}…`).toBe(true)
      numbers.push(n)
    }
  }
  return numbers
}

/** Rango cubierto por las coordenadas (posiciones pares = x, impares = y). */
function spans(numbers: number[]) {
  const xs = numbers.filter((_, i) => i % 2 === 0)
  const ys = numbers.filter((_, i) => i % 2 === 1)
  return {
    x: Math.max(...xs) - Math.min(...xs),
    y: Math.max(...ys) - Math.min(...ys),
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

describe('hand-drawn: determinismo por seed', () => {
  it.each(SHAPES)('%s: misma seed y dimensiones ⇒ mismo path', (name) => {
    const shape = handDrawnShapes[name]
    expect(shape(200, 40, 'seed-a')).toBe(shape(200, 40, 'seed-a'))
  })

  it.each(SHAPES)('%s: seeds distintas ⇒ paths distintos', (name) => {
    const shape = handDrawnShapes[name]
    expect(shape(200, 40, 'seed-a')).not.toBe(shape(200, 40, 'seed-b'))
  })

  it.each(SHAPES)('%s: dimensiones distintas ⇒ paths distintos', (name) => {
    const shape = handDrawnShapes[name]
    expect(shape(200, 40, 'seed-a')).not.toBe(shape(120, 80, 'seed-a'))
  })
})

describe('hand-drawn: validez sintáctica del d', () => {
  it.each(SHAPES)('%s: solo comandos M/L/Q/C con números finitos', (name) => {
    parsePath(handDrawnShapes[name](200, 40, 'syntax'))
    parsePath(handDrawnShapes[name](120, 80, 'syntax'))
  })
})

describe('hand-drawn: bounds por dimensiones', () => {
  // Cobertura mínima esperada del trazo, por shape. Las shapes de texto
  // escalan con el ancho de la caja; asterisk/spiral, con el lado menor.
  const coverage: Record<HandDrawnShapeName, { x: number; y: number; base?: 'min' }> = {
    underline: { x: 0.9, y: 0 },
    'wavy-underline': { x: 0.9, y: 0 },
    circle: { x: 0.95, y: 0.95 },
    highlight: { x: 0.9, y: 0 },
    strike: { x: 0.9, y: 0 },
    box: { x: 0.9, y: 0.9 },
    arrow: { x: 0.7, y: 0 },
    asterisk: { x: 0.6, y: 0.6, base: 'min' },
    spiral: { x: 0.7, y: 0.7, base: 'min' },
  }

  it.each(SHAPES)('%s: cubre la caja y no se escapa demasiado', (name) => {
    for (const [w, h] of [
      [200, 40],
      [120, 80],
    ] as const) {
      const s = spans(parsePath(handDrawnShapes[name](w, h, 'bounds')))
      const min = coverage[name]
      const baseX = min.base === 'min' ? Math.min(w, h) : w
      // Cubre la proporción esperada de cada eje…
      expect(s.x).toBeGreaterThanOrEqual(baseX * min.x)
      if (min.y > 0) expect(s.y).toBeGreaterThanOrEqual(Math.min(w, h) * min.y * 0.5)
      // …y ninguna coordenada se va a más de media caja fuera de los bordes.
      expect(s.minX).toBeGreaterThanOrEqual(-w * 0.5)
      expect(s.maxX).toBeLessThanOrEqual(w * 1.5)
      expect(s.minY).toBeGreaterThanOrEqual(-h * 0.75)
      expect(s.maxY).toBeLessThanOrEqual(h * 1.75)
    }
  })
})

describe('hand-drawn: doble pasada', () => {
  it('passes=2 emite dos subpaths (dos comandos M)', () => {
    const d = underline(200, 40, 'passes', { passes: 2 })
    expect(d.split('M').length - 1).toBe(2)
  })

  it('passes=1 emite un único subpath', () => {
    const d = underline(200, 40, 'passes', { passes: 1 })
    expect(d.split('M').length - 1).toBe(1)
  })
})
