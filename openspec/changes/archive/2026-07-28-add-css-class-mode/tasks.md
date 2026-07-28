# add-css-class-mode — Tasks

## 1. Consolidar la fuente única de CSS

- [x] 1.1 Extraer a `styles.ts` co-locado el CSS que hoy vive inline en `index.tsx`: GlitchText (base), AnimatedBackground (base; las variantes ya son módulos), BorderBeam — sin cambio de comportamiento, tests existentes verdes
- [x] 1.2 Tests unitarios de las funciones de CSS extraídas (presencia de clases, vars con fallback)

## 2. Migrar reduced-motion a CSS (@media + opt-out)

- [x] 2.1 ShinyText: loop activado por clase, regla `@media` con `:not([data-aui-motion])`; el componente setea `data-aui-motion` solo con `respectReducedMotion={false}` y deja de togglear `data-aui-loop`
- [x] 2.2 GlitchText: ídem, preservando el split estático atenuado en `hover` bajo la preferencia
- [x] 2.3 AnimatedBackground: ídem, reemplazando `data-aui-static` (todas las variantes, incluidas animaciones de pseudo-elementos)
- [x] 2.4 BorderBeam: ídem, con el realce de borde estático como estado reducido
- [ ] 2.5 Tests por componente de paridad de `respectReducedMotion` (preferencia activa con y sin opt-out) y verificación en `test-app` con el control estándar

## 3. Funciones de registro

- [x] 3.1 Implementar y exportar `register*()` por efecto (idempotentes via `styleId`; `registerAnimatedBackground(variant?)` registra base + variante; `registerGlitchText(config?)` acepta cadencia) desde el entry del componente y el barrel
- [x] 3.2 Tests de idempotencia y SSR-safety de las funciones de registro

## 4. Archivos CSS publicados

- [x] 4.1 Script `scripts/build-css.mjs` que emite `dist/css/<efecto>.css` + `dist/css/animated-ui.css` desde las funciones de `styles.ts`, encadenado al build
- [x] 4.2 `package.json`: exports de los CSS publicados y `sideEffects` con `**/*.css`
- [x] 4.3 Test/verificación del build: los archivos emitidos coinciden con el CSS que inyectan los componentes (snapshot desde la misma fuente)

## 5. Documentación y verificación

- [x] 5.1 `README.md`: sección "CSS Class Mode (Zero-JS)" explicando cómo usar los CSS y `register*()`
- [x] 5.2 `README.md`: detallar el opt-out de accesibilidad (`data-aui-motion="true"`) para forzar animaciones
- [x] 5.3 `README.md`: mencionar `@media (prefers-reduced-motion)` como nuevo default
- [x] 5.4 `test-app`: verificar manualmente en el browser que el toggle de motion del harness impacta los 4 componentes consumidos solo por clases/vars (sin montar los componentes)
- [x] 5.5 Verificación manual en un HTML plano (sin React) con `dist/css/animated-ui.css`
