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
- [x] 2.5 Integrar Shiki en build time para los bloques de código (ejemplos `?raw` de /examples + snippets de uso); verificar que el bundle cliente no incluye highlighter

## 3. Layout, i18n y vista de componente

- [x] 3.1 Layout: header (logo, versión desde package.json, selector ES/EN que conserva la vista, link GitHub) + sidebar agrupado por categoría con activo resaltado y filtro por nombre; tema dark con vars `--docs-*`, responsive
- [x] 3.2 i18n: diccionarios tipados `es.ts`/`en.ts` para el chrome, hook `useLang()`, persistencia de preferencia; validación de claves faltantes en build
- [x] 3.3 Vista de componente: título/descripción desde prosa MD, demo lazy (`React.lazy`), tabs de ejemplos con botón copiar (clipboard + feedback), tabla de props (EN desde JSON generado, ES desde `props.es.json`), tabla de CSS vars y limitaciones desde la prosa
- [x] 3.4 Home/galería por categorías con dogfooding (AnimatedBackground en hero, SpotlightCard/BorderBeam en cards); verificar prefers-reduced-motion en el chrome
- [x] 3.5 Piloto con 4 componentes de categorías distintas (e.g. TiltCard, ShinyText, WavesBackground, ConfettiBurst): prosa es/en, demo curado, snippet de uso, `props.es.json` — validar el pipeline completo end-to-end

## 4. Contenido de los 48 componentes

- [x] 4.1 Contenido docs Backgrounds (8 comp.): prosa es/en (base: README), demos curados, snippets, `props-es/`
- [x] 4.2 Contenido docs Tarjetas & Mouse (7 comp.)
- [x] 4.3 Contenido docs Texto (9 comp.)
- [x] 4.4 Contenido docs Scroll & Parallax (9 comp.: demos scroll-driven con modo `demoLayout: 'flow'` para los sticky)
- [x] 4.5 Contenido docs Cursor e Idle (7 comp.)
- [x] 4.6 Contenido docs Celebración, SVG y Layout (10 comp. incl. AnimatedList/AutoHeight del change FLIP) — total 50 componentes, build estricto OK
- [x] 4.7 Pasada de QA en browser (Playwright/Chrome): home dogfooding, deep links ES/EN, switch de idioma conservando vista, tabs + copy (clipboard verificado), filtro del sidebar, shiki, sin errores de runtime

## 5. Deploy a Hostinger

- [x] 5.1 Open questions resueltas con el usuario: server Hostinger con **nginx** (no Apache), **sin dominio** aún (se sirve por IP; dominio + TLS a futuro), subida por **SSH/SFTP**. Config documentada, no desplegada (el usuario ejecuta el deploy cuando tenga el server listo)
- [x] 5.2 Fallback SPA para el server: ejemplo `docs/deploy/nginx.conf.example` (`try_files … /index.html`) documentado como camino principal, y `.htaccess` para Apache incluido en el build (verificado: se copia a dist/). Base configurable vía `DOCS_BASE`. Config de nginx + primer deploy quedan a cargo del usuario (dependen del server de 5.1)
- [x] 5.3 Workflow de GitHub Actions on release (`deploy-docs.yml`): build librería + docs desde el tag y subida por **rsync sobre SSH** (secrets SSH_HOST/SSH_USER/SSH_PRIVATE_KEY, vars SSH_TARGET/SSH_PORT/DOCS_BASE); comando manual `npm run deploy` por **SFTP** (`ssh2-sftp-client`) documentado en `docs/README.md` como fallback

## 6. Cierre

- [x] 6.1 Mención de la web en README raíz (pointer a `docs/`) y AGENTS.md (fila `docs/` en documentos vinculantes). La spec `component-authoring` viva se actualiza con el delta al correr `/opsx:archive`
- [x] 6.2 Actualizar ROADMAP.md: marcar la web de docs (fila Docs en releases + sección "Web de documentación"), anotar mejoras futuras (tema light, playground de props, buscador, prerendering/SEO). AGENTS.md actualizado: fila docs/ + JSDoc público en inglés
