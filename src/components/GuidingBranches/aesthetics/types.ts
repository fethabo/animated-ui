/*
 * Contrato común de las estéticas de `GuidingBranches` (ver design.md,
 * Decisión 5): cada estética es un módulo que expone una función pura de
 * generación del crecimiento dado el PRNG, el origen, el sesgo direccional y
 * los parámetros. Agregar una estética nueva = agregar un módulo que cumpla
 * este contrato y registrarlo, sin tocar la API pública del componente.
 */
import type { Prng } from '../../../utils/prng'

export interface Point {
  x: number
  y: number
}

export interface BranchParams {
  /** Distancia máxima en px desde el origen que cualquier rama puede alcanzar. */
  maxDistance: number
  /** Densidad de ramificación (cantidad de troncos / probabilidad de hijos). */
  density: number
  /** Profundidad máxima de sub-ramificación. */
  depth: number
  /** Magnitud del jitter del trazo (estéticas tipo relámpago). */
  jitter: number
  /**
   * Curvatura del trazo (0 = casi recto, 1 = muy sinuoso). En `roots` controla
   * cuánto se arquean las raíces; estéticas que no curvan MAY ignorarlo.
   */
  curl: number
  /** Ángulo (rad) de sesgo hacia el target en modo directed, o `null` en ambient. */
  bias: number | null
}

/**
 * Una rama: polilínea + `delay` (px de crecimiento del árbol antes de aparecer)
 * + `width` opcional (factor 0..1 de grosor, para afinar las ramas finas).
 */
export interface Branch {
  points: Point[]
  delay: number
  width?: number
}

/** Módulo de estética enchufable: nombre + generador puro de ramas. */
export interface AestheticModule {
  name: string
  generate(rng: Prng, origin: Point, params: BranchParams): Branch[]
}
