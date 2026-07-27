# fix-docs-control-defaults — Tasks

## 1. Corregir los dos errores de unidad

- [ ] 1.1 `docs/src/demos/click-spark.tsx`: `duration` a segundos (`min: 0.1, max: 1.5, step: 0.05, default: 0.4`), coherente con `duration * FRAMES_PER_SECOND` de `ClickSpark`
- [ ] 1.2 `docs/src/demos/cursor-trail.tsx`: `life` a segundos (`min: 0.2, max: 2, step: 0.1, default: 0.6`), coherente con `p.life -= dt` de `CursorTrail`
- [ ] 1.3 Verificar en el navegador: la ráfaga de ClickSpark se apaga en ~0.4 s y la estela de CursorTrail se desvanece con el puntero quieto; en ambos casos el RAF se detiene (sin trabajo por frame en reposo)

## 2. Campo `override` en el descriptor de controles

- [ ] 2.1 `docs/src/content.ts`: agregar `override?: string` a las seis variantes de `DemoControl`
- [ ] 2.2 Documentar en el comentario de `DemoModule` cuándo corresponde `override` (divergencia deliberada del default de la librería) y cuándo no (nunca para saltarse un rango inalcanzable)

## 3. Guard de fidelidad en el build de contenido

- [ ] 3.1 `docs/scripts/build-content.mjs`: helper de normalización (comillas envolventes, arrays de strings elemento a elemento, booleanos, números) sobre `defaultValue` de `props.json` y `control.default`
- [ ] 3.2 Invariante I1 — `default` del control coincide con el de la librería; se exime si el control declara `override`. Error con slug, prop, ambos valores y la sugerencia de agregar `override`
- [ ] 3.3 Invariante I2 — para controles `number`, el default de la librería cae en `[min, max]`. **No** se exime por `override`. Error indicando el rango declarado y el valor inalcanzable
- [ ] 3.4 Reportar como warning la lista de controles cuyo `defaultValue` es `null` en `props.json` (inverificables), con el total, para que el agujero de cobertura sea visible en cada build
- [ ] 3.5 Verificar que el guard, corrido sobre el árbol previo a la tarea 1, falla exactamente en `click-spark.duration` y `cursor-trail.life` por I2

## 4. Anotar las divergencias deliberadas

- [ ] 4.1 Correr el guard y anotar con `override` los pares `(demo, prop)` que divergen a propósito, con el motivo real de cada uno (no un texto genérico)
- [ ] 4.2 Revisar caso por caso en la pasada: una divergencia sin motivo defendible es un default a corregir, no a anotar
- [ ] 4.3 `npm run build` en `docs/` verde con el guard activo

## 5. Cierre

- [ ] 5.1 Paridad con el test-app: los controles de ClickSpark y CursorTrail en ambas apps declaran la misma escala para `duration`/`life`
- [ ] 5.2 `npx eslint` sobre los archivos modificados de `docs/`
