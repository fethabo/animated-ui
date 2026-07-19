# add-css-class-mode — Tasks

## 1. Consolidar la fuente única de CSS

- [ ] 1.1 Extraer a `styles.ts` co-locado el CSS que hoy vive inline en `index.tsx`: GlitchText (base), AnimatedBackground (base; las variantes ya son módulos), BorderBeam — sin cambio de comportamiento, tests existentes verdes
- [ ] 1.2 Tests unitarios de las funciones de CSS extraídas (presencia de clases, vars con fallback)

## 2. Migrar reduced-motion a CSS (@media + opt-out)

- [ ] 2.1 ShinyText: loop activado por clase, regla `@media` con `:not([data-aui-motion])`; el componente setea `data-aui-motion` solo con `respectReducedMotion={false}` y deja de togglear `data-aui-loop`
- [ ] 2.2 GlitchText: ídem, preservando el split estático atenuado en `hover` bajo la preferencia
- [ ] 2.3 AnimatedBackground: ídem, reemplazando `data-aui-static` (todas las variantes, incluidas animaciones de pseudo-elementos)
- [ ] 2.4 BorderBeam: ídem, con el realce de borde estático como estado reducido
- [ ] 2.5 Tests por componente de paridad de `respectReducedMotion` (preferencia activa con y sin opt-out) y verificación en `test-app` con el control estándar

## 3. Funciones de registro

- [ ] 3.1 Implementar y exportar `register*()` por efecto (idempotentes via `styleId`; `registerAnimatedBackground(variant?)` registra base + variante; `registerGlitchText(config?)` acepta cadencia) desde el entry del componente y el barrel
- [ ] 3.2 Tests de idempotencia y SSR-safety de las funciones de registro

## 4. Archivos CSS publicados

- [ ] 4.1 Script `scripts/build-css.mjs` que emite `dist/css/<efecto>.css` + `dist/css/animated-ui.css` desde las funciones de `styles.ts`, encadenado al build
- [ ] 4.2 `package.json`: exports de los CSS publicados y `sideEffects` con `**/*.css`
- [ ] 4.3 Test/verificación del build: los archivos emitidos coinciden con el CSS que inyectan los componentes (snapshot desde la misma fuente)

## 5. Documentación y verificación

- [ ] 5.1 README: sección "modo clase" con las recetas de los 4 efectos (markup, clases, atributos, vars con defaults, limitaciones)
- [ ] 5.2 Docs site: recetas de modo clase en las páginas de los 4 componentes (ES/EN)
- [ ] 5.3 Verificación en `test-app`: página de modo clase con los 4 efectos consumidos solo por clases/vars (sin montar los componentes)
- [ ] 5.4 Verificación manual en un HTML plano (sin React) con `dist/css/animated-ui.css`
