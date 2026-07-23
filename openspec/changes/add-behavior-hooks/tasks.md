# add-behavior-hooks — Tasks

## 1. Infraestructura compartida

- [x] 1.1 Crear el helper enhance-and-restore en `src/utils/` (snapshot/restore de `position` inline, manejo de clases `aui-`, CSS vars, inyección/remoción de capas hijas por referencia) con tests unitarios y test SSR (`*.ssr.test.ts`)
- [x] 1.2 Test del helper para idempotencia bajo StrictMode (attach → destroy → attach sin fugas de listeners/capas)

## 2. TiltCard (efecto piloto, valida el patrón)

- [x] 2.1 Extraer la lógica WAAPI de tilt a `src/components/TiltCard/engine.ts` (`attach(host, options) → { update, destroy }`, DOM puro, flag `reducedMotion` pasivo) con tests
- [x] 2.2 Implementar `useTilt` en `src/components/TiltCard/use-tilt.ts`: callback ref, shallow-compare de opciones con fast-path de vars, composición con `useReducedMotion`, perspectiva dentro del transform, tipo de opciones sin `glare`
- [x] 2.3 Refactorizar `TiltCard/index.tsx` para delegar en el motor preservando API, DOM y render prop actuales; verificar que los tests existentes pasan sin modificarse
- [x] 2.4 Exportar `useTilt` desde el entry del componente y el barrel `src/index.ts`; verificar tree-shaking del subpath

## 3. MagneticElement

- [x] 3.1 Extraer motor a `engine.ts` (WAAPI translate con momentum y retorno elástico) con tests
- [x] 3.2 Implementar `useMagnetic` (tipo de opciones sin `hitArea`) y refactorizar el componente sobre el motor
- [x] 3.3 Exportar desde entry y barrel

## 4. SpotlightCard

- [x] 4.1 Extraer motor a `engine.ts` (tracking de vars + inyección/remoción del overlay via helper) con tests
- [x] 4.2 Implementar `useSpotlight` y refactorizar el componente sobre el motor
- [x] 4.3 Exportar desde entry y barrel

## 5. GlowBorder

- [x] 5.1 Extraer motor a `engine.ts` (loop cónico + `followCursor` WAAPI + inyección de capa + padding/overflow/isolation del host con restore) con tests
- [x] 5.2 Implementar `useGlowBorder` y refactorizar el componente sobre el motor
- [x] 5.3 Exportar desde entry y barrel

## 6. Verificación integral

- [x] 6.1 `npm run typecheck` y `npm run test` verdes; tests SSR de los 4 hooks
- [x] 6.2 Verificación visual en `test-app`: demo lado a lado componente vs hook por efecto (mismo comportamiento con opciones equivalentes), incluyendo control de `respectReducedMotion`
- [ ] 6.3 Probar los 4 hooks sobre un componente de terceros real que forwardee ref (validación de integración genérica en entorno real)

## 7. Documentación

- [x] 7.1 README: sección "modo hook" por componente (snippet, tabla de opciones con defaults, limitaciones `glare`/`hitArea`/contrato del host de glow)
- [x] 7.2 Docs site: agregar el modo hook a las páginas de los 4 componentes (prosa ES/EN, snippet, entradas de props/opciones en `props.es.json`) — nota: el extractor de props solo procesa las props del componente, así que las opciones de los hooks se documentan como prosa (sin entradas nuevas en props-es)
- [x] 7.3 JSDoc en inglés para todas las opciones públicas de los hooks con `Default:` explícito
- [x] 7.4 Actualizar `AGENTS.md` si el patrón motor/hook/componente cambia la guía de estructura de componentes
