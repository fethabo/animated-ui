import { describe, expect, it } from 'vitest'
import { DEFAULT_CHARSET, scrambleFrame } from './scramble'

describe('scrambleFrame', () => {
  it('es determinista con una fuente de aleatoriedad inyectada', () => {
    const alwaysFirst = () => 0
    expect(scrambleFrame('abc', 0, 'XY', alwaysFirst)).toBe('XXX')
    expect(scrambleFrame('abc', 0, 'XY', alwaysFirst)).toBe(scrambleFrame('abc', 0, 'XY', alwaysFirst))
  })

  it('revela los primeros N caracteres y scramblea el resto', () => {
    expect(scrambleFrame('hola', 2, 'X', () => 0)).toBe('hoXX')
  })

  it('preserva el whitespace del texto original en todos los frames', () => {
    expect(scrambleFrame('ab cd', 0, 'X', () => 0)).toBe('XX XX')
    expect(scrambleFrame('a\tb\nc', 0, 'X', () => 0)).toBe('X\tX\nX')
  })

  it('con revealed >= longitud retorna el texto final exacto', () => {
    expect(scrambleFrame('hola mundo', 10, DEFAULT_CHARSET, Math.random)).toBe('hola mundo')
    expect(scrambleFrame('corto', 99, DEFAULT_CHARSET, Math.random)).toBe('corto')
  })

  it('opera por code points: no parte surrogates del texto', () => {
    // '🎉' son 2 unidades UTF-16 pero 1 code point: cuenta como 1 carácter.
    const frame = scrambleFrame('🎉ab', 1, 'X', () => 0)
    expect(frame).toBe('🎉XX')
  })

  it('elige del charset por code points (charset con emoji no se corrompe)', () => {
    expect(scrambleFrame('ab', 0, '🟩🟦', () => 0)).toBe('🟩🟩')
    expect(scrambleFrame('ab', 0, '🟩🟦', () => 0.9)).toBe('🟦🟦')
  })

  it('clampea una fuente de aleatoriedad que retorna 1 (no indexa fuera del pool)', () => {
    expect(scrambleFrame('a', 0, 'XY', () => 1)).toBe('Y')
  })

  it('con charset vacío retorna el texto final (sin caracteres para scramblear)', () => {
    expect(scrambleFrame('hola', 0, '', Math.random)).toBe('hola')
  })

  it('texto vacío retorna vacío', () => {
    expect(scrambleFrame('', 0, DEFAULT_CHARSET, Math.random)).toBe('')
  })
})
