import { describe, expect, it } from 'vitest'
import { createParticles, cursorForce, rescaleParticles, stepParticles, type Particle } from './physics'

// Generador determinista para tests reproducibles.
function seqRandom(values: number[]): () => number {
  let i = 0
  return () => values[i++ % values.length]
}

describe('createParticles', () => {
  it('crea exactamente `count` partículas', () => {
    const ps = createParticles({ count: 30, width: 100, height: 100, speed: 1 })
    expect(ps).toHaveLength(30)
  })

  it('posiciones dentro del bounds y velocidades dentro de [-speed, speed]', () => {
    const ps = createParticles({ count: 200, width: 320, height: 240, speed: 2 })
    for (const p of ps) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(320)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(240)
      expect(Math.abs(p.vx)).toBeLessThanOrEqual(2)
      expect(Math.abs(p.vy)).toBeLessThanOrEqual(2)
    }
  })

  it('usa la fuente de aleatoriedad inyectada', () => {
    const ps = createParticles({ count: 1, width: 100, height: 50, speed: 1, random: seqRandom([0.5]) })
    expect(ps[0]).toEqual({ x: 50, y: 25, vx: 0, vy: 0 })
  })
})

describe('stepParticles', () => {
  const baseOpts = {
    width: 100,
    height: 100,
    cursor: null,
    cursorRadius: 50,
    cursorInteraction: 'repel' as const,
    radius: 2,
    maxSpeed: 10,
  }

  it('integra la posición sumando la velocidad', () => {
    const ps: Particle[] = [{ x: 50, y: 50, vx: 3, vy: -2 }]
    stepParticles(ps, baseOpts)
    expect(ps[0].x).toBe(53)
    expect(ps[0].y).toBe(48)
  })

  it('rebota en el borde derecho invirtiendo vx', () => {
    const ps: Particle[] = [{ x: 99, y: 50, vx: 5, vy: 0 }]
    stepParticles(ps, baseOpts)
    expect(ps[0].x).toBe(98) // width - radius
    expect(ps[0].vx).toBeLessThan(0)
  })

  it('rebota en el borde superior invirtiendo vy', () => {
    const ps: Particle[] = [{ x: 50, y: 1, vx: 0, vy: -5 }]
    stepParticles(ps, baseOpts)
    expect(ps[0].y).toBe(2) // radius
    expect(ps[0].vy).toBeGreaterThan(0)
  })

  it('clampea la velocidad a maxSpeed', () => {
    const ps: Particle[] = [{ x: 50, y: 50, vx: 999, vy: -999 }]
    stepParticles(ps, { ...baseOpts, maxSpeed: 4 })
    expect(ps[0].vx).toBeLessThanOrEqual(4)
    expect(ps[0].vy).toBeGreaterThanOrEqual(-4)
  })
})

describe('createParticles — modos de deriva', () => {
  it('snow: velocidad vertical inicial hacia abajo (vy >= 0)', () => {
    const ps = createParticles({ count: 50, width: 100, height: 100, speed: 1, drift: 'snow' })
    for (const p of ps) expect(p.vy).toBeGreaterThanOrEqual(0)
  })

  it('embers: sube (vy <= 0) e inicializa `life` en [0, 1]', () => {
    const ps = createParticles({ count: 50, width: 100, height: 100, speed: 1, drift: 'embers' })
    for (const p of ps) {
      expect(p.vy).toBeLessThanOrEqual(0)
      expect(p.life).toBeGreaterThanOrEqual(0)
      expect(p.life).toBeLessThanOrEqual(1)
    }
  })

  it('bubbles: sube (vy <= 0) y no usa `life`', () => {
    const ps = createParticles({ count: 50, width: 100, height: 100, speed: 1, drift: 'bubbles' })
    for (const p of ps) {
      expect(p.vy).toBeLessThanOrEqual(0)
      expect(p.life).toBeUndefined()
    }
  })

  it('bounce (default): no inicializa `life`', () => {
    const ps = createParticles({ count: 10, width: 100, height: 100, speed: 1 })
    for (const p of ps) expect(p.life).toBeUndefined()
  })
})

describe('stepParticles — modos de deriva', () => {
  const driftOpts = {
    width: 100,
    height: 100,
    cursor: null,
    cursorRadius: 50,
    cursorInteraction: 'none' as const,
    radius: 2,
    maxSpeed: 10,
    speed: 1,
  }

  function stepN(p: Particle, opts: typeof driftOpts & { drift: 'snow' | 'embers' | 'bubbles' }, n: number) {
    const ps = [p]
    for (let i = 0; i < n; i++) stepParticles(ps, opts)
    return ps[0]
  }

  it('snow: la velocidad converge hacia abajo (dirección dominante)', () => {
    const p = stepN({ x: 50, y: 50, vx: 0, vy: 0 }, { ...driftOpts, drift: 'snow' }, 100)
    expect(p.vy).toBeGreaterThan(0)
  })

  it('embers: la velocidad converge hacia arriba (dirección dominante)', () => {
    const p = stepN({ x: 50, y: 50, vx: 0, vy: 0, life: 1 }, { ...driftOpts, drift: 'embers' }, 30)
    expect(p.vy).toBeLessThan(0)
  })

  it('bubbles: la velocidad converge hacia arriba (dirección dominante)', () => {
    const p = stepN({ x: 50, y: 50, vx: 0, vy: 0 }, { ...driftOpts, drift: 'bubbles' }, 30)
    expect(p.vy).toBeLessThan(0)
  })

  it('snow hace wrap por arriba al salir por abajo (no rebota)', () => {
    const ps: Particle[] = [{ x: 50, y: 99, vx: 0, vy: 5 }]
    stepParticles(ps, { ...driftOpts, drift: 'snow' })
    expect(ps[0].y).toBe(0) // reaparece arriba
    expect(ps[0].vy).toBeGreaterThan(0) // sigue cayendo, no invirtió
  })

  it('bubbles hace wrap por abajo al salir por arriba', () => {
    const ps: Particle[] = [{ x: 50, y: 1, vx: 0, vy: -5 }]
    stepParticles(ps, { ...driftOpts, drift: 'bubbles' })
    expect(ps[0].y).toBe(100) // reaparece abajo
    expect(ps[0].vy).toBeLessThan(0)
  })

  it('embers: la vida decae cada frame', () => {
    const ps: Particle[] = [{ x: 50, y: 50, vx: 0, vy: 0, life: 1 }]
    stepParticles(ps, { ...driftOpts, drift: 'embers' })
    expect(ps[0].life).toBeLessThan(1)
    expect(ps[0].life).toBeGreaterThan(0.99)
  })

  it('embers: al agotarse la vida reingresa desde abajo con vida plena', () => {
    const ps: Particle[] = [{ x: 50, y: 50, vx: 0, vy: 0, life: 0.002 }]
    stepParticles(ps, { ...driftOpts, drift: 'embers' })
    expect(ps[0].life).toBe(1)
    expect(ps[0].y).toBeGreaterThan(90) // reposicionada cerca del borde inferior
  })

  it('warp: cae hacia abajo y se abre hacia el costado (izquierda da vx<0)', () => {
    // Centro en x=50. Partícula a la izquierda del centro y con profundidad.
    const ps: Particle[] = [{ x: 10, y: 50, vx: 0, vy: 0 }]
    stepParticles(ps, { ...driftOpts, drift: 'warp', maxSpeed: 1000 })
    expect(ps[0].vx).toBeLessThan(0) // se abre hacia la izquierda
    expect(ps[0].vy).toBeGreaterThan(0) // cae hacia abajo
  })

  it('warp: una partícula en el centro cae casi recto (vx ~ 0)', () => {
    const ps: Particle[] = [{ x: 50, y: 50, vx: 0, vy: 0 }]
    stepParticles(ps, { ...driftOpts, drift: 'warp', maxSpeed: 1000 })
    expect(ps[0].vx).toBeCloseTo(0)
    expect(ps[0].vy).toBeGreaterThan(0)
  })

  it('warp: cae más rápido cuanto mayor la profundidad (perspectiva)', () => {
    const near: Particle[] = [{ x: 50, y: 20, vx: 0, vy: 0 }]
    const far: Particle[] = [{ x: 50, y: 95, vx: 0, vy: 0 }]
    stepParticles(near, { ...driftOpts, drift: 'warp', maxSpeed: 1000 })
    stepParticles(far, { ...driftOpts, drift: 'warp', maxSpeed: 1000 })
    expect(far[0].vy).toBeGreaterThan(near[0].vy)
  })

  it('warp: al salir por abajo renace en el borde superior, a lo ancho de todo el plano', () => {
    const ps: Particle[] = [{ x: 50, y: 200, vx: 0, vy: 0 }]
    stepParticles(ps, { ...driftOpts, drift: 'warp', maxSpeed: 1000 })
    expect(ps[0].y).toBe(0) // reaparece arriba
    expect(ps[0].x).toBeGreaterThanOrEqual(0)
    expect(ps[0].x).toBeLessThanOrEqual(100) // dentro del ancho
  })

  it('warp: distintas partículas que reingresan caen en x distintas (no un solo punto)', () => {
    const a: Particle[] = [{ x: 17, y: 200, vx: 0, vy: 0 }]
    const b: Particle[] = [{ x: 83, y: 200, vx: 0, vy: 0 }]
    stepParticles(a, { ...driftOpts, drift: 'warp', maxSpeed: 1000 })
    stepParticles(b, { ...driftOpts, drift: 'warp', maxSpeed: 1000 })
    expect(a[0].x).not.toBeCloseTo(b[0].x)
  })
})

describe('stepParticles — regresión bounce (default idéntico)', () => {
  const baseOpts = {
    width: 100,
    height: 100,
    cursor: null,
    cursorRadius: 50,
    cursorInteraction: 'repel' as const,
    radius: 2,
    maxSpeed: 10,
  }

  it("drift='bounce' explícito produce el mismo resultado que omitir drift", () => {
    const a: Particle[] = [{ x: 30, y: 40, vx: 1.3, vy: -0.7 }]
    const b: Particle[] = [{ x: 30, y: 40, vx: 1.3, vy: -0.7 }]
    for (let i = 0; i < 50; i++) {
      stepParticles(a, baseOpts)
      stepParticles(b, { ...baseOpts, drift: 'bounce' })
    }
    expect(a[0]).toEqual(b[0])
  })

  it('bounce sigue rebotando en el borde derecho (no wrap)', () => {
    const ps: Particle[] = [{ x: 99, y: 50, vx: 5, vy: 0 }]
    stepParticles(ps, { ...baseOpts, drift: 'bounce' })
    expect(ps[0].x).toBe(98)
    expect(ps[0].vx).toBeLessThan(0)
  })
})

describe('cursorForce', () => {
  it('repele: empuja la partícula en dirección contraria al cursor', () => {
    // Partícula a la derecha del cursor → fuerza hacia la derecha (fx > 0).
    const { fx, fy } = cursorForce(60, 50, { x: 50, y: 50 }, 50, 'repel')
    expect(fx).toBeGreaterThan(0)
    expect(fy).toBeCloseTo(0)
  })

  it('atrae: empuja la partícula hacia el cursor', () => {
    const { fx } = cursorForce(60, 50, { x: 50, y: 50 }, 50, 'attract')
    expect(fx).toBeLessThan(0)
  })

  it('sin efecto fuera del radio', () => {
    expect(cursorForce(200, 50, { x: 50, y: 50 }, 50, 'repel')).toEqual({ fx: 0, fy: 0 })
  })

  it("sin efecto con mode 'none'", () => {
    expect(cursorForce(55, 50, { x: 50, y: 50 }, 50, 'none')).toEqual({ fx: 0, fy: 0 })
  })

  it('la fuerza crece al acercarse al cursor', () => {
    const near = cursorForce(55, 50, { x: 50, y: 50 }, 50, 'repel')
    const far = cursorForce(95, 50, { x: 50, y: 50 }, 50, 'repel')
    expect(Math.abs(near.fx)).toBeGreaterThan(Math.abs(far.fx))
  })
})

describe('rescaleParticles', () => {
  it('reescala posiciones proporcionalmente al nuevo tamaño', () => {
    const ps: Particle[] = [{ x: 50, y: 25, vx: 0, vy: 0 }]
    rescaleParticles(ps, 100, 50, 200, 100)
    expect(ps[0].x).toBe(100)
    expect(ps[0].y).toBe(50)
  })

  it('no hace nada si el tamaño previo es degenerado', () => {
    const ps: Particle[] = [{ x: 10, y: 10, vx: 0, vy: 0 }]
    rescaleParticles(ps, 0, 0, 200, 100)
    expect(ps[0]).toEqual({ x: 10, y: 10, vx: 0, vy: 0 })
  })
})
