# Tasks: docs-site

## 1. Migración de JSDoc a inglés (src/**/types.ts)

- [x] 1.1 Migrar JSDoc a inglés: Backgrounds (AnimatedBackground, PixelBackground, WavesBackground, FlowField, TopographicBackground, CircuitBackground, StarfieldBackground, MatrixRain) — conservar defaults `Default: \`x\`` y notas; `npm run typecheck && npm test`
- [x] 1.2 Migrar JSDoc a inglés: Tarjetas & Mouse (TiltCard, SpotlightCard, GlowBorder, MagneticElement, RippleContainer, BorderBeam, TeslaCoil) — typecheck + test
- [x] 1.3 Migrar JSDoc a inglés: Texto (ShinyText, ScrambleText, TypewriterText, SplitReveal, RotatingText, GlitchText, WavyText, CountUp, TextHighlighter) — typecheck + test
- [x] 1.4 Migrar JSDoc a inglés: Scroll & Parallax (ScrollReveal, ScrollProgress, MouseParallax, ParallaxLayers, StickyScenes, StackedCards, TextScrollReveal, HorizontalScrollSection, ImageDissolve) — typecheck + test
- [x] 1.5 Migrar JSDoc a inglés: Cursor e Idle (CursorTrail, CustomCursor, ImageTrail, ClickSpark, AttentionCue, GuidingBranches, ParticleField) — typecheck + test
- [x] 1.6 Migrar JSDoc a inglés: Celebración y SVG (ConfettiBurst, FireworksBurst, SparkleBurst, EmojiBurst, DrawPath, ScribbleDecoration, Dock, Marquee) + hooks públicos (useInView, etc.) — typecheck + test

## 2. Scaffolding de docs/ y pipeline de contenido

- [x] 2.1 Crear app `docs/` (Vite + React + TS, dep `@fethabo/animated-ui` file:.., react-router) con rutas `/:lang/components/:slug`, redirect de `/` por preferencia/navigator.language, y build funcionando
- [x] 2.2 Crear manifest del registry (`docs/src/registry.ts`): slug, categoría (8 categorías del design D2), refs a demo/prosa/ejemplo; script que lo cruza con los `exports` de `package.json` y falla el build ante export sin entrada o entrada huérfana (nota: incluye AnimatedList y AutoHeight del change FLIP — 50 componentes)
- [x] 2.3 Script `docs/scripts/extract-props.mjs` con react-docgen-typescript: emite `src/generated/props.json` por componente (gitignoreado; corre en predev/prebuild vía build-content.mjs); soporte de overrides por prop desde el manifest (381 props / 50 componentes)
- [x] 2.4 Validaciones de completitud en build: prosa es/en, demo, `examples/<slug>.tsx` (con override `example` en registry), snippet de uso y cobertura de `props.es.json` — fallo con mensaje que identifica slug + artefacto/prop faltante; warning por huérfanas; modo `--lax` (warnings) para dev
- [ ] 2.5 Integrar Shiki en build time para los bloques de código (ejemplos `?raw` de /examples + snippets de uso); verificar que el bundle cliente no incluye highlighter

## 3. Layout, i18n y vista de componente

- [ ] 3.1 Layout: header (logo, versión desde package.json, selector ES/EN que conserva la vista, link GitHub) + sidebar agrupado por categoría con activo resaltado y filtro por nombre; tema dark con vars `--docs-*`, responsive
- [ ] 3.2 i18n: diccionarios tipados `es.ts`/`en.ts` para el chrome, hook `useLang()`, persistencia de preferencia; validación de claves faltantes en build
- [ ] 3.3 Vista de componente: título/descripción desde prosa MD, demo lazy (`React.lazy`), tabs de ejemplos con botón copiar (clipboard + feedback), tabla de props (EN desde JSON generado, ES desde `props.es.json`), tabla de CSS vars y limitaciones desde la prosa
- [ ] 3.4 Home/galería por categorías con dogfooding (AnimatedBackground en hero, SpotlightCard/BorderBeam en cards); verificar prefers-reduced-motion en el chrome
- [ ] 3.5 Piloto con 4 componentes de categorías distintas (e.g. TiltCard, ShinyText, WavesBackground, ConfettiBurst): prosa es/en, demo curado, snippet de uso, `props.es.json` — validar el pipeline completo end-to-end

## 4. Contenido de los 48 componentes

- [ ] 4.1 Contenido docs Backgrounds (8 comp.): prosa es/en (base: README), demos curados, snippets, `props.es.json`
- [ ] 4.2 Contenido docs Tarjetas & Mouse (7 comp.)
- [ ] 4.3 Contenido docs Texto (9 comp.)
- [ ] 4.4 Contenido docs Scroll & Parallax (9 comp.)
- [ ] 4.5 Contenido docs Cursor e Idle (7 comp.)
- [ ] 4.6 Contenido docs Celebración, SVG y Layout (8 comp.: bursts, ClickSpark, DrawPath, ScribbleDecoration, Dock, Marquee)
- [ ] 4.7 Pasada de QA: navegar los 48 en ES y EN, demos one-shot disparados por botón, deep links y recarga, filtro del sidebar, copy en ambos tabs

## 5. Deploy a Hostinger

- [ ] 5.1 Resolver open questions con el usuario: dominio/subdominio destino y método de subida (FTP vs SSH) en Hostinger
- [x] 5.2 `.htaccess` con rewrite SPA incluido en el build output (verificado: se copia a dist/); base configurable vía `DOCS_BASE`. Primer deploy manual y verificación en producción quedan a cargo del usuario (dependen de credenciales/dominio de 5.1)
- [x] 5.3 Workflow de GitHub Actions on release (`deploy-docs.yml`): build librería + docs desde el tag y subida a Hostinger por FTP (secrets FTP_SERVER/USERNAME/PASSWORD); comando manual `npm run deploy` documentado en `docs/README.md` como fallback

## 6. Cierre

- [ ] 6.1 Actualizar spec `component-authoring` viva vía archive (JSDoc en inglés + página de docs en el definition-of-done) y mencionar la web en README y AGENTS.md
- [x] 6.2 Actualizar ROADMAP.md: marcar la web de docs (fila Docs en releases + sección "Web de documentación"), anotar mejoras futuras (tema light, playground de props, buscador, prerendering/SEO). AGENTS.md actualizado: fila docs/ + JSDoc público en inglés
