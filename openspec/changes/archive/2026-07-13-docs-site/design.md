# Design: docs-site

## Context

La librería tiene hoy cuatro fuentes de documentación desacopladas entre sí:

- `README.md`: doc exhaustiva por componente (props, CSS vars, limitaciones), en español.
- `examples/*.tsx`: 49 ejemplos standalone copy-paste, uno por componente.
- `test-app/`: playground Vite con un demo por componente + `ControlPanel` que varía props en runtime (herramienta interna de verificación visual, spec `test-app-harness`).
- `src/**/types.ts`: JSDoc por prop, en español, de buena calidad (es lo que ve el consumer en el autocomplete).

No existe web navegable, ni versión en inglés, ni garantía de sincronía entre lo publicado y lo documentado. La app de docs debe mostrar **exactamente** los componentes de la versión publicada, agrupados, con demo vivo, props, ejemplos y limitaciones, en ES/EN, con estética dark liviana.

Restricción del proyecto: el paquete publicado no puede sumar dependencias de runtime; todo lo nuevo vive en `docs/` como devDependencies.

## Goals / Non-Goals

**Goals:**

- Web de documentación en `docs/` (Vite + React, SPA) con una vista independiente por componente, header + sidebar con índice agrupado por categoría.
- Contenido derivado del código en build time: props desde JSDoc de `types.ts`, índice desde `exports` de `package.json`. La desincronización rompe el build, no pasa silenciosa.
- i18n ES/EN con el idioma en la URL.
- JSDoc de `src/**/types.ts` en inglés como fuente canónica (correcto para la audiencia npm); español como capa de traducción en `docs/`.
- Demo vivo por componente, lazy-loaded; dos ejemplos de código con botón copiar.
- Deploy estático a Hostinger (Apache) con URLs limpias, atado al flujo de release.
- Bundle liviano: sin framework de docs, sin CSS framework, highlighting resuelto en build time.

**Non-Goals:**

- No se rediseña ni reemplaza `test-app/` (sigue siendo la herramienta de desarrollo; spec `test-app-harness` intacta).
- No se traduce el README (sigue en español, spec `readme-docs` sin cambios).
- No hay SSR/prerendering ni SEO en esta iteración.
- No hay playground de props editable en v1 (el demo es curado; el `ControlPanel` de test-app cubre esa necesidad para desarrollo). Puede agregarse después.
- No hay buscador full-text en v1 (el sidebar con filtro por nombre alcanza para 48 items).

## Decisions

### D1 — App Vite independiente en `docs/`, sin framework de docs

Docusaurus/Starlight/Nextra imponen su stack, su estética y peso de runtime. Una SPA Vite + React con CSS plano da control total del look dark y permite dogfooding real (el sitio consume `@fethabo/animated-ui` vía `file:..`, igual que test-app). Alternativa considerada: Astro con islands — mejor para SEO, pero SEO es non-goal y agregaría un segundo modelo mental de rendering.

### D2 — Registry derivado de `package.json` exports + manifest curado

En build time, un script lee los subpath `exports` de `package.json` (la lista canónica de lo publicado) y lo cruza con un manifest curado en `docs/src/registry.ts` que aporta lo no derivable: categoría, slug, orden, y referencias a demo/prosa/ejemplo. Validación bidireccional: un export sin entrada en el manifest, o una entrada sin export, **rompe el build**. Así "mostrar todos los componentes de la versión actual" es una invariante verificada, no una convención. Los entry points no-componente (`.` raíz) se excluyen con una lista explícita.

Categorías (siguiendo los tiers del ROADMAP y la agrupación del README): Backgrounds · Tarjetas & Mouse · Texto · Scroll & Parallax · Cursor · Celebración (one-shot) · SVG & Decoración · Layout & Navegación.

### D3 — Extracción de props con `react-docgen-typescript` en build time

Script `docs/scripts/extract-props.mjs` que corre antes de `vite build` (y en dev) y emite un `props.generated.json` por componente: nombre, tipo, requerido, default y descripción (el JSDoc). Se elige `react-docgen-typescript` sobre `ts-morph` porque ya resuelve herencia de `HTMLAttributes`, `Omit<>`, defaults en JSDoc y filtrado de props nativas; ts-morph exigiría reimplementar todo eso. El JSON generado se commitea o se genera en CI — decisión operativa en tasks; lo importante es que nunca se edita a mano.

Las CSS custom properties `--aui-*` y las limitaciones no son derivables de tipos: viven en la prosa por componente (D5).

### D4 — Migración de JSDoc a inglés (opción B), con capa de traducción ES en docs

Los JSDoc de `src/**/types.ts` pasan a inglés: es lo que ve cualquier consumer npm en su editor y se vuelve la fuente de la tabla de props EN. La tabla ES se arma con `docs/content/props.es.json` — un mapa `componente.prop → descripción en español` (materia prima: los JSDoc actuales, que ya están en español). El extractor valida cobertura: prop pública sin traducción ES ⇒ build de docs falla. Cambio solo de comentarios: cero impacto en API o comportamiento; los `.d.ts` publicados cambian de idioma (aceptado y deseado). `component-authoring` se extiende para exigir JSDoc en inglés de acá en más.

### D5 — Contenido por componente: prosa en Markdown ES/EN + demo curado

Por componente: `docs/content/<slug>.es.md` y `<slug>.en.md` con frontmatter (título, descripción corta, categoría-override opcional) y secciones de características, CSS custom properties y limitaciones — el README actual es la materia prima para ES. Los demos son componentes React en `docs/src/demos/<slug>.tsx`, curados para la web (los de test-app son crudos y dependen del harness; se pueden adaptar, no importar). Cada vista se carga con `React.lazy` + `import()` dinámico: un demo canvas-pesado no afecta a las demás rutas.

### D6 — Dos ejemplos de código por componente, con copy

Tabs en cada vista: **"Uso del paquete"** (snippet corto `import { X } from '@fethabo/animated-ui/x'`, mantenido en la prosa o como archivo aparte) y **"Standalone copy-paste"** (el contenido literal de `examples/<slug>.tsx` importado con `?raw` de Vite — cero duplicación con el asset existente). Botón copiar en ambos (`navigator.clipboard`). Highlighting con **Shiki en build time** (plugin Vite o paso del extractor que emite HTML), para no shippear un highlighter al cliente; alternativa descartada: Prism en runtime (+15 kB y flash de contenido sin colorear).

### D7 — Routing: history con `react-router`, idioma en la ruta

Rutas: `/:lang(es|en)/` (home/galería), `/:lang/components/:slug` (vista de componente), redirect de `/` al idioma guardado en `localStorage` o `navigator.language`. Se elige `react-router` sobre wouter por soporte maduro de layouts anidados y params con validación; el costo (~20 kB gz) es aceptable frente al non-goal de micro-optimizar. En Hostinger, `.htaccess` con rewrite de rutas no-archivo a `index.html` habilita las URLs limpias.

### D8 — i18n propio, sin librería

Con dos idiomas y una app chica, i18next es sobre-ingeniería. Diccionario tipado `docs/src/i18n/{es,en}.ts` para el chrome (labels, navegación, títulos de sección), hook `useLang()` que lee el param de ruta, y los tres canales de contenido ya definidos: prosa `*.{es,en}.md`, props EN generadas + `props.es.json`, ejemplos de código (idioma-neutros, comentarios del standalone quedan como están en `examples/`). Validación en build: clave de diccionario o archivo de prosa faltante en un idioma ⇒ build falla.

### D9 — Estética: dark-only, CSS plano, dogfooding

Dark como único tema en v1 (afín a la librería; un toggle de light es trivial de sumar después con CSS vars). CSS plano con custom properties propias del sitio (`--docs-*`, sin invadir el namespace `--aui-*`). El chrome del sitio usa la propia librería: `AnimatedBackground` en el hero de la home, `SpotlightCard`/`BorderBeam` en la galería de categorías, `ScrollProgress` en las vistas largas — la web es en sí misma una demo, y cualquier regresión de la librería se nota en la docs.

### D10 — Deploy a Hostinger integrado al release

`docs/` buildea a estático (`docs/dist`) junto con `.htaccess`. La publicación se engancha al flujo de release existente: un workflow de GitHub Actions que, al publicarse una release (tag), buildea la librería, buildea `docs/` contra esa versión y sube por FTP/SFTP a Hostinger (credenciales en secrets del repo). Así la web refleja siempre la última versión **publicada** y nunca el estado intermedio de `main`. Alternativa descartada: deploy en cada push a main (mostraría componentes aún no publicados, violando el requisito).

## Risks / Trade-offs

- [La migración de 48 `types.ts` a inglés es mecánica pero grande; una traducción descuidada degrada la DX del autocomplete] → Migrar por lotes por categoría, revisando que cada JSDoc conserve defaults y notas de comportamiento; los tests y `typecheck` corren por lote (los comentarios no afectan, pero valida que no se tocó código).
- [`react-docgen-typescript` puede extraer mal props complejas (render props, uniones, `Omit` encadenados)] → Snapshot del JSON generado revisado en la primera corrida; entradas problemáticas admiten override manual en el manifest antes que forzar el extractor.
- [Drift entre `props.es.json` y las props reales] → Es el riesgo central del diseño y está mitigado por construcción: la validación de cobertura en build convierte el drift en error visible.
- [Demos pesados (canvas/WebGL) pueden degradar la navegación] → Lazy por ruta (D5) + demos montados solo cuando visibles; los one-shot (confetti, fireworks) se disparan por botón, no en mount.
- [Deploy por FTP a Hostinger es frágil (credenciales, timeouts)] → Workflow idempotente que sube a carpeta temporal y renombra; deploy manual documentado como fallback (`npm run docs:deploy`).
- [Duplicación conceptual entre demos de docs y demos de test-app] → Aceptada deliberadamente: test-app optimiza para verificación exhaustiva con controles; docs optimiza para comunicar. Compartir código acoplaría la herramienta interna a la web pública.
- [El README y la web pueden divergir en la prosa] → Aceptado en v1: el README sigue siendo la fuente para GitHub/npm (spec `readme-docs`), la web tiene su propia prosa. `component-authoring` exige actualizar ambos en el definition-of-done.

## Migration Plan

1. Migrar JSDoc de `types.ts` a inglés por lotes (sin tocar código; `typecheck` + `test` por lote). Se puede mergear antes que la web — mejora npm por sí sola.
2. Scaffolding de `docs/` + pipeline (registry, extractor, validaciones) con 3–4 componentes piloto de categorías distintas.
3. Completar los 48: prosa ES/EN, demos, snippets de uso, `props.es.json`.
4. Workflow de deploy + `.htaccess`; primer deploy manual a Hostinger para validar el hosting antes de automatizar.
5. Rollback: la web es estática y aislada — se re-sube el build anterior; la librería no depende de docs en ningún punto.

## Open Questions

- Dominio/subdominio final en Hostinger y método de subida disponible (FTP vs SSH/rsync) — no bloquea el diseño, sí la task de deploy.
- ¿El `props.generated.json` se commitea (diff visible en PRs) o se genera solo en CI/build (repo más limpio)? Propuesta por defecto: generarlo en build y no commitearlo.
