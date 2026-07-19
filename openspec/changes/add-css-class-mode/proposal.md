# add-css-class-mode

## Why

Los efectos Pure CSS de la librería (ShinyText, GlitchText, AnimatedBackground, BorderBeam) no requieren JS por frame, pero hoy su CSS solo existe cuando el componente React monta e inyecta los estilos. Eso impide el modo de consumo más liviano posible: aplicar una clase `aui-*` (+ CSS vars) a cualquier elemento — un componente de otro design system, una isla de Astro sin hidratar, HTML plano. Habilitar ese modo extiende la premisa copy-paste de la librería hacia consumo sin React, sin agregar dependencias ni romper el zero-config del modo componente.

## What Changes

- El CSS de los efectos Pure CSS pasa a estar disponible sin montar componentes, por dos canales con fuente única (los mismos strings de `styles.ts`):
  - **Funciones de registro** exportadas (e.g. `registerShinyText()`): inyectan el CSS via `injectStyles` una vez, para apps React/JS que quieren solo la clase.
  - **Archivos CSS publicados** en el paquete (`dist/css/<efecto>.css` + bundle completo), generados en build desde la misma fuente, para contextos sin JS (Astro estático, HTML).
- Reduced motion se resuelve en CSS: los efectos Pure CSS ganan una regla `@media (prefers-reduced-motion: reduce)` con opt-out por atributo (`data-aui-motion`), reemplazando el toggle por JS. El componente conserva la prop `respectReducedMotion` con idéntica semántica (con `false` setea el atributo de opt-out).
- Parametrización en modo clase exclusivamente via CSS vars `--aui-*` ya existentes; el markup requerido por cada efecto (e.g. `data-text` en GlitchText, las dos capas de BorderBeam) se documenta como receta.
- `package.json`: exports para los archivos CSS y ajuste de `sideEffects` (`false` → lista que excluye `*.css`) para que los bundlers no purguen las hojas importadas.
- Documentación del modo clase (README + docs site) con recetas por efecto y sus limitaciones.

## Capabilities

### New Capabilities

- `css-class-mode`: contrato del modo de consumo por clase — canales de distribución con fuente única, activación y reduced-motion via CSS, parametrización por vars, recetas de markup requerido, y qué efectos califican.

### Modified Capabilities

- `shiny-text`: el efecto SHALL ser consumible aplicando `.aui-shiny` sin montar el componente; reduced-motion pasa de atributo JS a `@media` con opt-out.
- `glitch-text`: el efecto SHALL ser consumible con `.aui-glitch` + `data-text`; en modo clase la cadencia queda en los defaults (los keyframes parametrizados por `frequency`/`burstDuration` requieren el componente).
- `animated-background`: las variantes SHALL ser consumibles con `.aui-bg .aui-<variante>` como capa hija de un contenedor `position: relative`.
- `border-beam`: el efecto SHALL ser consumible con la receta de markup documentada (host + capa + cometa).

## Impact

- **Código**: extracción de los CSS de los 4 efectos a `styles.ts` co-locados (los que no lo tienen aún) con funciones `register*()`; migración del gating de reduced-motion de atributo JS a `@media` en esos CSS; script/step de build que emite `dist/css/*` desde la misma fuente.
- **Build/paquete**: `tsup.config.ts` o script de build para los `.css`; `package.json` (`exports` de CSS, `sideEffects`); el tarball crece con los archivos CSS.
- **Componentes afectados**: ShinyText, GlitchText, AnimatedBackground, BorderBeam — API pública sin cambios; DOM cambia solo en atributos internos de gating (no documentados como API).
- **Docs/verificación**: README, docs site, `test-app` (verificación del modo clase y del opt-out), tests de generación de CSS y SSR.
- **Riesgo principal**: la inversión del gating de reduced-motion debe preservar la semántica exacta de `respectReducedMotion` en el modo componente.
