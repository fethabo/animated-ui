import { describe, expect, it } from 'vitest'
import { typewriterFrameAt, type TypewriterConfig } from './typewriter'

const base: TypewriterConfig = {
  speed: 10, // 10 cps → 100ms por carácter
  deleteSpeed: 20, // 20 cps → 50ms por carácter
  pauseDuration: 500,
  startDelay: 0,
  loop: false,
}

describe('typewriterFrameAt — string único (no loop)', () => {
  it('en t=0 no muestra nada', () => {
    expect(typewriterFrameAt(['hola'], 0, base)).toEqual({ text: '', done: false })
  })

  it('progresa por timestamp: ~1 carácter cada 100ms a 10 cps', () => {
    expect(typewriterFrameAt(['hola'], 100, base).text).toBe('h')
    expect(typewriterFrameAt(['hola'], 250, base).text).toBe('ho')
    expect(typewriterFrameAt(['hola'], 350, base).text).toBe('hol')
  })

  it('al completar el texto queda done', () => {
    const state = typewriterFrameAt(['hola'], 5000, base)
    expect(state).toEqual({ text: 'hola', done: true })
  })

  it('respeta startDelay antes de empezar', () => {
    const cfg = { ...base, startDelay: 500 }
    expect(typewriterFrameAt(['hola'], 400, cfg)).toEqual({ text: '', done: false })
    expect(typewriterFrameAt(['hola'], 600, cfg).text).toBe('h') // 100ms tras el delay
  })

  it('con arreglo y loop=false solo escribe el primer string', () => {
    const state = typewriterFrameAt(['uno', 'dos'], 5000, base)
    expect(state).toEqual({ text: 'uno', done: true })
  })

  it('opera por code points: no parte surrogates', () => {
    // '🎉' es 1 code point; a 100ms (1 carácter) muestra el emoji entero.
    expect(typewriterFrameAt(['🎉ab'], 150, base).text).toBe('🎉')
  })
})

describe('typewriterFrameAt — modo loop multi-string', () => {
  const cfg: TypewriterConfig = { ...base, loop: true }
  // 'ab': type 200ms (2×100), pause 500ms, delete 100ms (2×50) → 800ms
  // 'cd': type 200ms, pause 500ms, delete 100ms → 800ms ; ciclo total 1600ms

  it('escribe el primer string al inicio del ciclo', () => {
    expect(typewriterFrameAt(['ab', 'cd'], 100, cfg).text).toBe('a')
    expect(typewriterFrameAt(['ab', 'cd'], 200, cfg).text).toBe('ab')
  })

  it('mantiene el string completo durante la pausa', () => {
    // 200ms..700ms es la pausa de 'ab'
    expect(typewriterFrameAt(['ab', 'cd'], 400, cfg).text).toBe('ab')
    expect(typewriterFrameAt(['ab', 'cd'], 690, cfg).text).toBe('ab')
  })

  it('borra tras la pausa', () => {
    // 700ms..800ms borra 'ab' a 20 cps (50ms/carácter)
    expect(typewriterFrameAt(['ab', 'cd'], 760, cfg).text).toBe('a') // borró 1
  })

  it('avanza al siguiente string en el tramo siguiente', () => {
    // 800ms inicia 'cd'
    expect(typewriterFrameAt(['ab', 'cd'], 900, cfg).text).toBe('c')
    expect(typewriterFrameAt(['ab', 'cd'], 1000, cfg).text).toBe('cd')
  })

  it('cicla: vuelve al primer string tras completar el último', () => {
    // 1600ms = inicio de un ciclo nuevo
    expect(typewriterFrameAt(['ab', 'cd'], 1600 + 100, cfg).text).toBe('a')
  })

  it('nunca reporta done en modo loop', () => {
    expect(typewriterFrameAt(['ab', 'cd'], 200, cfg).done).toBe(false)
    expect(typewriterFrameAt(['ab', 'cd'], 9999, cfg).done).toBe(false)
  })

  it('strings todos vacíos no entran en loop infinito (cycleDuration 0)', () => {
    expect(typewriterFrameAt(['', ''], 1000, cfg)).toEqual({ text: '', done: false })
  })
})
