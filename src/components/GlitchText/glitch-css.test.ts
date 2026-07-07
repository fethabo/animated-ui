import { describe, expect, it } from 'vitest'
import { buildGlitchCss, burstWindows, glitchLayerKeyframes } from './glitch-css'

describe('burstWindows', () => {
  it('produce tantas ráfagas como frequency, dentro del ciclo', () => {
    for (const f of [1, 2, 3, 5]) {
      const windows = burstWindows(f, 0.1)
      expect(windows).toHaveLength(f)
      for (const w of windows) {
        expect(w.start).toBeGreaterThanOrEqual(0)
        expect(w.end).toBeLessThanOrEqual(100)
        expect(w.end).toBeGreaterThan(w.start)
      }
    }
  })

  it('las ráfagas no se solapan (períodos estables entre medio)', () => {
    const windows = burstWindows(4, 0.5)
    for (let i = 1; i < windows.length; i++) {
      expect(windows[i].start).toBeGreaterThan(windows[i - 1].end)
    }
  })

  it('una fracción mayor produce ráfagas más largas', () => {
    const shortBursts = burstWindows(2, 0.1)
    const longBursts = burstWindows(2, 0.5)
    expect(longBursts[0].end - longBursts[0].start).toBeGreaterThan(
      shortBursts[0].end - shortBursts[0].start,
    )
  })

  it('clampea valores degenerados', () => {
    expect(burstWindows(0, 0.1)).toHaveLength(1)
    expect(burstWindows(2.9, 0.1)).toHaveLength(2)
    const windows = burstWindows(1, 5) // fracción absurda → clampeada
    expect(windows[0].end).toBeLessThanOrEqual(100)
  })
})

describe('glitchLayerKeyframes', () => {
  it('cada ráfaga aporta frames visibles con desplazamiento y recortes', () => {
    const css = glitchLayerKeyframes('test-anim', burstWindows(3, 0.2), -1)
    expect(css).toContain('@keyframes test-anim')
    // Dos frames visibles por ráfaga (inicio y medio).
    expect((css.match(/opacity: 1/g) ?? []).length).toBe(6)
    expect(css).toContain('translateX(calc(-1 * var(--aui-glitch-intensity, 3px)))')
    expect(css).toContain('clip-path: inset(')
  })

  it('arranca y termina invisible (períodos estables)', () => {
    const css = glitchLayerKeyframes('test-anim', burstWindows(1, 0.2), 1)
    expect(css).toMatch(/0% \{ opacity: 0;/)
    expect(css).toMatch(/100% \{ opacity: 0;/)
  })
})

describe('buildGlitchCss', () => {
  it('genera los dos canales (signos opuestos) y las reglas loop/hover', () => {
    const css = buildGlitchCss('f2-b10', 2, 0.1)
    expect(css).toContain('@keyframes aui-glitch-a-f2-b10')
    expect(css).toContain('@keyframes aui-glitch-b-f2-b10')
    expect(css).toContain("[data-aui-trigger='loop']")
    expect(css).toContain("[data-aui-trigger='hover']:not([data-aui-static]):hover")
    expect(css).toContain('translateX(calc(-1 * var(--aui-glitch-intensity, 3px)))')
    expect(css).toContain('translateX(calc(1 * var(--aui-glitch-intensity, 3px)))')
  })

  it('la cantidad de ráfagas del CSS sigue a frequency', () => {
    const one = buildGlitchCss('k1', 1, 0.2)
    const four = buildGlitchCss('k4', 4, 0.2)
    const visibleFrames = (css: string) => (css.match(/opacity: 1/g) ?? []).length
    expect(visibleFrames(four)).toBe(visibleFrames(one) * 4)
  })
})
