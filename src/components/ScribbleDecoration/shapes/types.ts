/*
 * Contrato común de las shapes de `ScribbleDecoration` (ver design.md de
 * Wave L, decisión 6): cada shape es una función pura que recibe la caja
 * medida, la seed del jitter y opciones, y retorna el atributo `d` del path a
 * dibujar. Agregar una shape nueva = agregar un módulo que cumpla este
 * contrato y registrarlo — y el consumer puede pasar su propia función via la
 * prop `shape` sin tocar el paquete (patrón `aesthetics/` de GuidingBranches).
 */
import type { HandDrawnOptions } from '../../../utils/hand-drawn'

export interface ScribbleSize {
  width: number
  height: number
}

/** Shape enchufable: caja + seed (+ opciones de jitter/pasadas) ⇒ atributo `d`. */
export type ScribbleShape = (
  size: ScribbleSize,
  seed: string | number,
  options?: HandDrawnOptions,
) => string
