import { describe, expect, it } from 'vitest'
import { easeOut, formatValue } from './format'

describe('formatValue', () => {
  it('sin opciones formatea el entero redondeado', () => {
    expect(formatValue(42)).toBe('42')
    expect(formatValue(42.7)).toBe('43')
    expect(formatValue(0)).toBe('0')
  })

  it('aplica el separador de miles solo a la parte entera', () => {
    expect(formatValue(12500, { separator: '.' })).toBe('12.500')
    expect(formatValue(1234567, { separator: ',' })).toBe('1,234,567')
    expect(formatValue(999, { separator: '.' })).toBe('999')
    expect(formatValue(1234.567, { separator: ',', decimals: 2 })).toBe('1,234.57')
  })

  it('renderiza exactamente los decimales pedidos, estables en valores intermedios', () => {
    expect(formatValue(3.14159, { decimals: 1 })).toBe('3.1')
    expect(formatValue(7, { decimals: 2 })).toBe('7.00')
    // Valores intermedios de una cuenta: siempre la misma cantidad de decimales.
    for (const v of [0, 0.5, 1.25, 10.999, 99.001]) {
      const out = formatValue(v, { decimals: 1 })
      expect(out).toMatch(/^\d+\.\d$/)
    }
  })

  it('antepone el prefijo y pospone el sufijo', () => {
    expect(formatValue(12500, { separator: '.', suffix: '+' })).toBe('12.500+')
    expect(formatValue(99, { prefix: '$' })).toBe('$99')
    expect(formatValue(1500, { prefix: '$', separator: ',', suffix: ' USD' })).toBe('$1,500 USD')
  })

  it('maneja valores negativos con el signo después del prefijo', () => {
    expect(formatValue(-1250, { separator: '.' })).toBe('-1.250')
    expect(formatValue(-5, { prefix: '$' })).toBe('$-5')
  })
})

describe('easeOut', () => {
  it('empieza en 0 y termina exactamente en 1', () => {
    expect(easeOut(0)).toBe(0)
    expect(easeOut(1)).toBe(1)
  })

  it('es monótona creciente (la cuenta nunca retrocede)', () => {
    let prev = -1
    for (let t = 0; t <= 1.001; t += 0.05) {
      const v = easeOut(t)
      expect(v).toBeGreaterThanOrEqual(prev)
      prev = v
    }
  })

  it('es de salida: la primera mitad avanza más que la segunda', () => {
    expect(easeOut(0.5)).toBeGreaterThan(0.5)
  })

  it('clampea fuera de [0, 1]', () => {
    expect(easeOut(-0.5)).toBe(0)
    expect(easeOut(1.5)).toBe(1)
  })
})
