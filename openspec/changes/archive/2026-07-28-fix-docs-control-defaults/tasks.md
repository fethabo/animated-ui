# fix-docs-control-defaults — Tasks

## 1. Corregir los dos errores de unidad

- [x] 1.1 `docs/src/demos/click-spark.tsx`: `duration` a segundos (`min: 0.1, max: 1.5, step: 0.05, default: 0.4`), coherente con `duration * FRAMES_PER_SECOND` de `ClickSpark`
- [x] 1.2 `docs/src/demos/cursor-trail.tsx`: `life` a segundos (`min: 0.2, max: 2, step: 0.1, default: 0.6`), coherente con `p.life -= dt` de `CursorTrail`
- [x] 1.3 Verificado en Chrome headless por CDP (script en el job dir; sin puppeteer, cliente mínimo sobre el `WebSocket` global de Node). Se midió el canvas por píxel (`getImageData`, alpha != 0) y el RAF instrumentado, en vez de mirar un screenshot:
  - ClickSpark: pico 250 px pintados → canvas vacío a los **291 ms**, RAF detenido en el mismo instante, **23 RAF totales** (el `lifespan` es `0.4 × 60 = 24` frames)
  - CursorTrail: pico 1761 px pintados → con el puntero quieto, canvas vacío a los **499 ms**, RAF detenido en el mismo instante, 74 RAF totales
  - Screenshots de respaldo en t0 (efecto visible) y t+2 s / t+2.5 s (canvas limpio)

## 2. Campo `override` en el descriptor de controles

- [x] 2.1 `docs/src/content.ts`: agregar `override?: string` a las seis variantes de `DemoControl`
- [x] 2.2 Documentar en el comentario de `DemoModule` cuándo corresponde `override` (divergencia deliberada del default de la librería) y cuándo no (nunca para saltarse un rango inalcanzable)

## 3. Guard de fidelidad en el build de contenido

- [x] 3.1 `docs/scripts/control-fidelity.mjs`: parser de los descriptores (cursor explícito, respeta strings/comentarios/multilínea) + normalización (comillas envolventes, arrays elemento a elemento, booleanos, números). Verificado: 261 controles en 50 demos, coincide con el conteo previo
- [x] 3.2 Invariante I1 — `default` del control coincide con el de la librería; se exime si el control declara `override`. Error con slug, prop, ambos valores y la sugerencia de agregar `override`
- [x] 3.3 Invariante I2 — para controles `number`, el default de la librería cae en `[min, max]`. **No** se exime por `override`. Error indicando el rango declarado y el valor inalcanzable
- [x] 3.4 Reportar como warning la lista de controles inverificables, con el total. Dos motivos distintos: `defaultValue: null` en `props.json` (25) y prop que no es del componente raíz sino de un subcomponente enrutado por el demo (2: `mouse-parallax.depth`, `parallax-layers.depth`)
- [x] 3.5 Verificar que el guard, corrido sobre los descriptores previos a la tarea 1, falla en `click-spark.duration` y `cursor-trail.life` por I2 (y también por I1)
- [x] 3.6 **Hallazgo de I2**: `tesla-coil.frequency` era un tercer error de escala — rango `[0.5, 8]` default `3` sobre una prop que son regeneraciones/segundo con default `12`. Corregido a `min: 2, max: 30, default: 12` (igual que el test-app)

## 4. Anotar las divergencias deliberadas

- [x] 4.1 Anotadas con `override` las 74 divergencias restantes. Motivo por categoría: `deliberate` (25, el test-app también diverge), `trigger` (5, el frame ya está en viewport al abrir la vista), `palette` (8, el default no contrasta sobre el tema dark), `feature` (6, prop encendida para exhibirla), `demo` (30, valor propio del demo; el test-app usa el default de la librería)
- [x] 4.2 Revisión caso por caso usando el test-app como árbitro: de las 79, en 51 el test-app usa el default de la librería (sin referencia detrás) y en 25 también diverge. **Cinco resultaron compensaciones de los bugs de unidad** (`click-spark.size` 2→8, `cursor-trail.length` 15→36 y `emitEvery` 16→12, `tesla-coil.jitter` 6→18 y `lineWidth` 1.5→2): corregidas, no anotadas
- [x] 4.3 `npm run build` en `docs/` verde con el guard activo (`build-content` sin errores, `tsc --noEmit` limpio, `vite build` OK)

## 5. Cierre

- [x] 5.1 Paridad con el test-app: `click-spark.duration` (s), `cursor-trail.life` (s) y `tesla-coil.frequency` (Hz) declaran la misma escala en ambas apps
- [x] 5.2 ESLint: el proyecto no tiene configuración de ESLint (ni en la raíz ni en `docs/`), así que no aplica. Cubierto por `tsc --noEmit`
