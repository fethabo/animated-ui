# add-css-class-mode — Design

## Context

Todo el CSS de la librería nace en runtime: strings template-literal inyectados con `injectStyles(styleId(...), css)` al montar el componente ([src/utils/inject-styles.ts](../../../src/utils/inject-styles.ts)). No se publica ningún archivo `.css` (`files: ["dist"]`, sin assets), y `sideEffects: false`. Seis componentes ya separan su CSS en `styles.ts` con `xxxCss()`/`xxxVars()`; otros lo definen inline en `index.tsx`.

Los cuatro efectos Pure CSS en scope y su gating actual de animación:

- **ShinyText**: `.aui-shiny` estático; el loop se activa con `[data-aui-loop]`, que el componente setea solo si no aplica reduced motion.
- **GlitchText**: `.aui-glitch` + pseudo-elementos con `content: attr(data-text)`; keyframes de ráfagas **generados por configuración** (`buildGlitchCss(key, frequency, burstFraction)`) e inyectados por combinación; `[data-aui-static]` para el fallback de reduced motion.
- **AnimatedBackground**: `.aui-bg` base + una hoja por variante; `[data-aui-static]` apaga animaciones.
- **BorderBeam**: CSS estático, pero requiere estructura hija (`.aui-border-beam-layer` + `.aui-border-beam-comet`); `[data-aui-static]` para el realce estático.

## Goals / Non-Goals

**Goals:**

- Consumir estos efectos aplicando clases `aui-*` + CSS vars a cualquier elemento, sin montar componentes — incluso sin React (Astro estático, HTML).
- Fuente única de CSS: el modo componente, las funciones de registro y los archivos publicados emiten exactamente el mismo CSS.
- Reduced motion garantizado también en modo clase (hoy depende de JS).
- Zero-config del modo componente intacto; cambio 100% aditivo para consumers actuales.

**Non-Goals:**

- No se convierten a modo clase los efectos que requieren JS (observers, estado, canvas) ni los estructurales (Marquee duplica children, SplitReveal parte texto). ScrollReveal queda afuera (necesita IntersectionObserver).
- No se agregan integraciones específicas a ninguna UI library.
- No se cambia la API pública de ningún componente.

## Decisions

### 1. Dos canales de distribución, una fuente

El CSS de cada efecto vive (o se muda) a `styles.ts` co-locado como función pura. De ahí derivan los tres consumos:

1. **Componente** (hoy): `injectStyles` en `useEffect` — sin cambios.
2. **Función de registro** exportada por efecto (`registerShinyText()`, `registerAnimatedBackground(variant?)`, …): llama al mismo `injectStyles` (idempotente por `styleId`). Para apps React/JS que quieren la clase sin el componente. Viaja en el chunk del componente (subpath export existente) — tree-shaking preservado.
3. **Archivos publicados**: un script de build (`scripts/build-css.mjs`, corriendo tras `tsup`) importa las funciones `xxxCss()` y emite `dist/css/<efecto>.css` + `dist/css/animated-ui.css` (bundle de los efectos class-mode). Al generarse desde la misma fuente, no puede divergir.

*Alternativa descartada:* mantener archivos `.css` escritos a mano → dos fuentes de verdad, deriva garantizada.
*Alternativa descartada:* solo funciones de registro (sin archivos) → deja afuera el caso sin JS, que es la mitad del valor (Astro/HTML).

### 2. Reduced motion baja de JS a CSS, con opt-out por atributo

Se invierte el gating: la animación se activa por la clase (default), y una regla en el mismo CSS la apaga bajo la preferencia, salvo opt-out explícito:

```css
@media (prefers-reduced-motion: reduce) {
  .aui-shiny:not([data-aui-motion]) { animation: none; }
}
```

- **Modo clase**: reduced motion queda garantizado por CSS puro, sin JS. Mejora sobre el estado actual.
- **Modo componente**: `respectReducedMotion={true}` (default) no hace nada (el media query resuelve); `respectReducedMotion={false}` setea `data-aui-motion` en el root. La semántica pública es idéntica; los componentes de este scope dejan de necesitar `useReducedMotion` para el gating (menos JS).
- Los estados estáticos alternativos (realce de BorderBeam, split atenuado de GlitchText en hover) se expresan en la misma regla `@media`.

*Alternativa descartada:* mantener `data-aui-static` seteado por JS también en modo clase → obligaría a JS en el canal sin JS, que es contradictorio.

### 3. Alcance por efecto y recetas de markup

| Efecto | Modo clase | Limitación documentada |
|---|---|---|
| ShinyText | `class="aui-shiny"` en cualquier elemento de texto | ninguna |
| GlitchText | `class="aui-glitch" data-text="<mismo texto>"` | cadencia fija en defaults: los keyframes parametrizados por `frequency`/`burstDuration` requieren el componente; `colors`/`intensity` sí van por vars |
| AnimatedBackground | `class="aui-bg aui-<variante>"` como **capa hija** de un contenedor `position: relative` | no hay "modo host": la capa es `absolute inset:0` por diseño (evita colisión con pseudo-elementos y background del host) |
| BorderBeam | receta de 3 nodos: host `.aui-border-beam` + `.aui-border-beam-layer` + `.aui-border-beam-comet` | requiere copiar el markup hijo; vars para color/tamaño/duración |

El criterio de elegibilidad queda en la spec: califica un efecto cuyo runtime es 100% CSS y cuya estructura requerida sea expresable como receta estática de markup.

### 4. `sideEffects` y exports

`package.json` pasa de `"sideEffects": false` a `"sideEffects": ["**/*.css"]`, y agrega exports `"./css/*.css": "./dist/css/*.css"` (más el bundle). Sin esto, un consumer que haga `import '@fethabo/animated-ui/css/shiny-text.css'` vería el import purgado por el bundler. Los archivos van dentro de `dist/`, ya incluido en `files`.

### 5. GlitchText: keyframes por configuración quedan en el componente

`buildGlitchCss` genera `@keyframes` distintos por combinación (los steps del clip-path dependen de `frequency`/`burstFraction`, y un `@keyframes` no puede parametrizarse con vars). El CSS publicado incluye únicamente la configuración default. No se intenta emitir el producto cartesiano de configuraciones: el consumer que necesita otra cadencia usa el componente (o `registerGlitchText({frequency, burstDuration})`, que sí puede generar su variante en runtime).

## Risks / Trade-offs

- **[Semántica de respectReducedMotion]** La inversión del gating debe ser indistinguible para el consumer actual → tests por componente de ambos estados (preferencia activa con y sin opt-out) + verificación en `test-app` con el control estándar.
- **[Especificidad contra el CSS del consumer]** En modo clase, las reglas `aui-*` conviven con el CSS del host (Emotion, Tailwind) y el orden de inyección importa → las reglas se mantienen de especificidad mínima (una clase) y toda estética es var con fallback, pisable en cascada; se documenta.
- **[Doble carga CSS]** Un consumer puede importar el `.css` publicado y además montar componentes que inyectan lo mismo → inofensivo (reglas idénticas duplicadas); `injectStyles` no puede detectar la hoja estática. Se documenta como no-problema.
- **[Superficie de docs]** Cada efecto suma la receta de modo clase → se documenta como sección del componente, no página aparte.
- **[Tarball más grande]** Los `.css` publicados agregan unos KB → aceptable; el bundle completo es opt-in.

## Migration Plan

Aditivo, sin breaking. Orden: (1) extraer CSS a `styles.ts` donde falte (GlitchText base, AnimatedBackground variantes, BorderBeam) sin cambio de comportamiento; (2) migrar gating de reduced-motion a `@media` + opt-out, componente por componente, con sus tests; (3) funciones `register*()` + exports; (4) script `build-css` + `package.json` (`exports`, `sideEffects`); (5) docs y verificación. Rollback: quitar exports/script; las funciones de registro y el gating CSS son autónomos y no dependen del canal de archivos.

## Open Questions

- ¿El bundle completo (`animated-ui.css`) incluye solo los 4 efectos class-mode o también los CSS de layout de otros componentes? Propuesta: solo class-mode; revisar al implementar.
- ¿Naming de las funciones: `registerShinyText()` vs `registerShinyTextCss()`? Decisión de implementación (consistencia con `injectStyles`).
- ¿`docs/` gana una página general "modo clase" además de las secciones por componente? Decidir con el contenido en mano.
