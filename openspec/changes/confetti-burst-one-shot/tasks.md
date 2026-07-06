## 1. Física del confetti (módulo puro)

- [ ] 1.1 Crear `src/components/ConfettiBurst/physics.ts`: spawn en abanico (`angle`/`spread`/`power` con jitter via `createPrng`), integración con gravedad y drag, rotación/tumbling por copo, culling por salida del área u opacidad
- [ ] 1.2 Tests vitest de `physics.ts`: abanico dentro del cono configurado, caída por gravedad, culling completo (el pool se vacía), determinismo con seed fija, sin `Math.random`/`Date.now`

## 2. Componente y handle imperativo

- [ ] 2.1 Crear `src/components/ConfettiBurst/types.ts`: props (`count`, `colors`, `shapes`, `origin`, `angle`, `spread`, `power`, `gravity`, `respectReducedMotion`, `className`, `style`), `ConfettiBurstHandle` (`fire(options?)`) y `FireOptions` (subset overrideable por disparo)
- [ ] 2.2 Crear `src/components/ConfettiBurst/index.tsx`: `'use client'`, `forwardRef` + `useImperativeHandle`, canvas overlay `absolute inset:0` `pointer-events:none`, RAF que arranca en el primer `fire()` y se auto-detiene con el pool vacío, disparos acumulativos sobre el mismo pool, merge props+options por ráfaga, seed por contador interno, `fire()` no-op pre-hidratación y bajo reduced motion, CSS vars `--aui-confetti-*`, cleanup de RAF en unmount (StrictMode-safe)
- [ ] 2.3 Test `index.ssr.test.ts` + test de que `fire()` sin canvas montado no lanza

## 3. Exports y documentación

- [ ] 3.1 Exportar `ConfettiBurst`, `ConfettiBurstHandle` y tipos desde `src/index.ts`; agregar entry point a `package.json#exports` y `tsup.config.ts`
- [ ] 3.2 Documentar en README: sección con el patrón de uso (`useRef` + `fire()` en un handler), tabla de props/opciones, CSS vars, nota de reduced motion (no-op) y de cubrir viewport con contenedor `fixed`
- [ ] 3.3 Documentar en el design/README interno la convención one-shot para futuros efectos de la categoría (fireworks, sparkles)
- [ ] 3.4 Crear ejemplo standalone en `/examples` (solo React: botón que dispara la ráfaga)
- [ ] 3.5 Marcar Wave I ✅ en `ROADMAP.md` (Tier 4 + registrar el patrón one-shot)

## 4. Verificación (definition-of-done)

- [ ] 4.1 Demo en `test-app` con botón de disparo + panel de controles (`count`, `colors`, `origin`, `angle`, `spread`, `power`, `gravity`, `respectReducedMotion`) y alta en `demos/index.js`
- [ ] 4.2 Verificación visual: ráfagas acumulativas, look del copo (rect con tumbling), RAF detenido en reposo (verificar con devtools), clicks pasando a través del overlay
- [ ] 4.3 Correr vitest completo + typecheck + build; confirmar tree-shaking
- [ ] 4.4 Revisar cumplimiento de la spec `component-authoring` antes de archivar
