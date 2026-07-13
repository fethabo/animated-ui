## 1. Infraestructura compartida: esqueleto one-shot

- [x] 1.1 Evaluar la extracción del esqueleto one-shot de `ConfettiBurst` (overlay+canvas+resize, pool, RAF auto-detenible, seed por contador) a un módulo interno compartido; si requiere más de ~3 callbacks/opciones para cubrir los cinco consumers, documentar el descarte y saltar 1.2–1.3 (design.md, decisión 1) — extracción limpia: 1 callback (`stepAndDraw`) + closure de spawn por disparo
- [x] 1.2 Extraer el módulo compartido (`src/components/shared/use-one-shot-canvas.ts`) con tests vitest propios
- [x] 1.3 Migrar `ConfettiBurst` al módulo extraído verificando que sus tests existentes pasan sin cambios de comportamiento — 20 tests verdes

## 2. FireworksBurst

- [x] 2.1 Crear `src/components/FireworksBurst/physics.ts`: módulo puro con fases `rocket` (ascenso + wobble + apex) y `spark` (velocidades radiales, gravedad, drag, fade por vida), spawn escalonado de múltiples cohetes; tests vitest (apex dispara la explosión, culling, determinismo por seed)
- [x] 2.2 Crear `src/components/FireworksBurst/types.ts` (`colors`, `particleCount`, `rockets`, `power`, `origin`, `respectReducedMotion`, `className`, `style`; `FireworksBurstHandle` + `FireworksFireOptions`)
- [x] 2.3 Crear `src/components/FireworksBurst/index.tsx`: `'use client'`, overlay pasivo, `useImperativeHandle` con `fire(options?)`, props=defaults/options por disparo, RAF compartido auto-detenible, PRNG por contador, no-op pre-hidratación/sin canvas/reduced motion
- [x] 2.4 Test `index.ssr.test.ts` + test de no-op bajo reduced motion y de auto-stop del RAF — 13 tests verdes

## 3. SparkleBurst

- [x] 3.1 Crear `src/components/SparkleBurst/physics.ts`: módulo puro con envolvente de vida (crece→encoge), rotación individual y dispersión alrededor del origen; helper de path de estrella de 4 puntas; tests vitest
- [x] 3.2 Crear `src/components/SparkleBurst/types.ts` (`colors`, `count`, `size`, `spread`, `duration`, `origin`, `respectReducedMotion`, `className`, `style`; `SparkleBurstHandle` + `SparkleFireOptions`)
- [x] 3.3 Crear `src/components/SparkleBurst/index.tsx` aplicando el patrón one-shot (mismos requisitos que 2.3), con `origin` relativo al contenedor overrideable por disparo
- [x] 3.4 Test `index.ssr.test.ts` + test de no-op bajo reduced motion — 13 tests verdes

## 4. EmojiBurst

- [x] 4.1 Crear `src/components/EmojiBurst/physics.ts` (módulo propio: la física de confetti tiene tumbling 3D específico; acá rotación 2D simple): abanico `angle`/`spread`/`power`, gravedad, drag, rotación 2D, fade; selección de emoji por partícula via PRNG; tests vitest
- [x] 4.2 Crear `src/components/EmojiBurst/types.ts` (`emojis`, `count`, `size`, `angle`, `spread`, `power`, `origin`, `respectReducedMotion`, `className`, `style`; `EmojiBurstHandle` + `EmojiFireOptions`)
- [x] 4.3 Crear `src/components/EmojiBurst/index.tsx` aplicando el patrón one-shot; render con `fillText` seteando `font` una vez por tamaño; default de `count` conservador (30) por el costo de `fillText`
- [x] 4.4 Test `index.ssr.test.ts` + test de no-op bajo reduced motion — 12 tests verdes

## 5. ClickSpark

- [x] 5.1 Crear `src/components/ClickSpark/physics.ts`: chispas radiales cortas con fade (módulo puro; alcance calibrado por la integral geométrica del drag); tests vitest
- [x] 5.2 Crear `src/components/ClickSpark/types.ts` (`colors`, `count`, `size`, `radius`, `duration`, `respectReducedMotion`, `children`, `className`, `style` — sin handle)
- [x] 5.3 Crear `src/components/ClickSpark/index.tsx`: `'use client'`, wrapper con listener `pointerdown` + canvas overlay `pointer-events:none`, ráfagas concurrentes en el mismo RAF, no-op bajo reduced motion con children intactos (compone el `onPointerDown` del consumer)
- [x] 5.4 Test `index.ssr.test.ts` + test de que el overlay no intercepta eventos (children interactivos) — 13 tests verdes

## 6. Exports y documentación

- [x] 6.1 Exportar los cuatro componentes, tipos y handles desde `src/index.ts`; agregar cuatro entry points a `package.json#exports` y `tsup.config.ts`
- [x] 6.2 Documentar en README: fila en la tabla de componentes + sección (snippet con ref/`fire()`, tabla de props, options de disparo) por componente; nota de render de emojis por plataforma en EmojiBurst
- [x] 6.3 Crear ejemplos standalone en `/examples` para los cuatro componentes (sin importar el paquete, solo React)
- [x] 6.4 Marcar Wave J ✅ en `ROADMAP.md` (Tier 6)

## 7. Verificación (definition-of-done)

- [x] 7.1 Demo + descriptor de controles en `test-app` para cada componente (botón de disparo para los imperativos; incluye control estándar de `respectReducedMotion`) y alta en `demos/index.js`
- [x] 7.2 Verificación visual en `test-app`: cohetes con apex y explosión, destellos pulsantes, emojis con tumbling, chispas por click con children interactivos; auto-stop del RAF en los cuatro (sin RAF en reposo, verificable en devtools) — confirmado por humano; smoke automatizado OK (demos transforman, dist exporta los 4, auto-stop cubierto por tests)
- [x] 7.3 Correr vitest completo + typecheck + build; confirmar tree-shaking de los entry points nuevos — 524 tests verdes, `tsc --noEmit` limpio, 4 entries nuevos en dist (ESM+CJS+DTS)
- [x] 7.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar — verificado: APIs nativas, estructura estándar, `'use client'` + SSR-safe (tests `*.ssr.test.ts`), `injectStyles`, props + CSS vars `--aui-*-color-<i>` (EmojiBurst sin vars de color: el color lo aporta el glifo, documentado), `respectReducedMotion` default `true`, root extensible, exports tree-shakeables, README + examples + panel de controles
