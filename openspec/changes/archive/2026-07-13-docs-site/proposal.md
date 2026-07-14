# Proposal: docs-site

## Why

La librería publica 48 componentes documentados solo en un README monolítico de GitHub: no hay demos vivos navegables, la doc no es explorable por categoría y no existe versión en inglés para la audiencia npm. Se necesita una web de documentación que muestre todos los componentes de la versión publicada, con ejemplos interactivos, tablas de props y ejemplos copy-paste — y que no pueda desincronizarse del paquete porque su contenido se deriva del código fuente en build time.

## What Changes

- Nueva app `docs/` (Vite + React) hermana de `test-app/`, servida como SPA con history routing: header (logo, versión, selector ES/EN, link a GitHub) + sidebar con índice agrupado por categoría + una vista independiente por componente (ruta `/:lang/components/:slug`).
- Pipeline de contenido en build time: las tablas de props se auto-generan desde los JSDoc de `src/**/types.ts`, y el índice de componentes se deriva de los `exports` de `package.json` — un componente publicado sin página de docs rompe el build.
- **BREAKING (interno, no de API)**: los JSDoc de `src/**/types.ts` migran de español a inglés como fuente canónica (lo que ve un consumer npm en el autocomplete del editor). El español pasa a ser capa de traducción mantenida en `docs/`.
- i18n ES/EN seleccionable, con el idioma en la ruta; prosa por componente en archivos `*.es.md` / `*.en.md`; validación en build de traducciones faltantes.
- Cada vista de componente incluye: demo vivo (lazy-loaded por ruta), dos ejemplos de código con botón de copiar (uso del paquete + standalone desde `examples/*.tsx` vía import `?raw`), tabla de props, CSS custom properties y limitaciones.
- Estética dark, moderna y liviana, con dogfooding: el sitio usa los propios componentes de la librería (AnimatedBackground, SpotlightCard, ScrollProgress, etc.). Sin frameworks de docs ni CSS frameworks.
- Deploy a servidor propio (Hostinger, Apache): build estático + `.htaccess` para SPA routing, enganchado al flujo de release para que la web siempre refleje la última versión publicada.
- El `test-app/` se mantiene intacto como herramienta de desarrollo; la docs solo incorpora lo publicado.

## Capabilities

### New Capabilities

- `docs-site`: la aplicación web de documentación — layout (header + sidebar), routing por componente, vista de componente (demo vivo, ejemplos con copy, props, CSS vars, limitaciones), estética dark liviana con dogfooding de la librería.
- `docs-content-pipeline`: generación del contenido en build time — extracción de props desde los JSDoc de `types.ts`, registry de componentes derivado de los `exports` de `package.json`, categorización, y validaciones de build (componente sin docs o traducción faltante ⇒ build falla).
- `docs-i18n`: internacionalización ES/EN — idioma en la ruta, diccionario de UI, prosa por componente en ambos idiomas, capa de traducción al español de las descripciones de props.
- `docs-deploy`: build y publicación del sitio en hosting propio (Apache/Hostinger) con URLs limpias, integrado al flujo de release.

### Modified Capabilities

- `component-authoring`: (1) los JSDoc de las props en `types.ts` se escriben en inglés (fuente canónica para npm y para la docs); (2) el definition-of-done de todo componente nuevo o modificado incluye su página en la web de documentación (prosa ES/EN + demo + ejemplos).

## Impact

- **Código nuevo**: carpeta `docs/` (app Vite independiente, dependencia `file:..` como test-app), script de extracción de props (build time), archivo `.htaccess`.
- **Código existente**: los 48 `src/**/types.ts` cambian sus comentarios JSDoc a inglés (sin cambio de API ni de comportamiento — solo comentarios; los `.d.ts` publicados cambian de idioma).
- **Specs**: `component-authoring` se extiende (idioma de JSDoc + docs-site en el definition-of-done). `readme-docs` no cambia: el README sigue siendo obligatorio y en español.
- **Dependencias**: solo devDependencies dentro de `docs/` (vite, react-router o wouter, shiki para highlighting en build, react-docgen-typescript o ts-morph para extracción). Cero impacto en las dependencias del paquete publicado.
- **Procesos**: el flujo de release (`scripts/release.mjs` / CI) suma el paso de build + deploy de la docs.
- **Fuera de alcance**: rediseñar test-app, traducir el README, SEO/prerendering (la SPA se sirve tal cual; puede evaluarse después).
