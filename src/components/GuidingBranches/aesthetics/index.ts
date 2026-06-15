/*
 * Registro de estéticas de `GuidingBranches`. Agregar una estética nueva =
 * crear su módulo (que cumpla `AestheticModule`) e incluirlo acá: queda
 * disponible vía la prop `aesthetic` sin cambiar la firma del componente.
 */
import { roots } from './roots'
import { lightning } from './lightning'
import { circuit } from './circuit'
import type { AestheticModule } from './types'

export const aesthetics = {
  roots,
  lightning,
  circuit,
} satisfies Record<string, AestheticModule>

/** Nombres de estética disponibles (claves del registro). */
export type AestheticName = keyof typeof aesthetics

export type { AestheticModule, Branch, BranchParams, Point } from './types'
