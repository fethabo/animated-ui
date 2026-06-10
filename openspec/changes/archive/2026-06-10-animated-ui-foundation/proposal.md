## Why

No existe una librería de componentes animados para React que sea realmente liviana, framework-agnostic (Vite / Next.js / Astro), y que ofrezca control total sobre animaciones y estilos sin hardcodear clases. Aceternity UI es el referente visual del ecosistema pero depende de Framer Motion (~35kb), no es tree-shakeable, y sus estilos son difíciles de customizar. `@fethabo/animated-ui` apunta a superar esa barra con cero dependencias de animación externas, bundle mínimo, y una API de CSS custom properties que le da al dev control total.

## What Changes

- **Nueva librería npm** `@fethabo/animated-ui` publicada bajo el scope `@fethabo`
- **Sistema de CSS injection** sin necesidad de importar stylesheets — los keyframes se inyectan automáticamente al montar el componente
- **Tres componentes iniciales** con defaults visualmente atractivos y API completamente customizable:
  - `AnimatedBackground` — background animado configurable con variantes `aurora`, `mesh`, `noise`, `beam`
  - `PixelBackground` — grilla de píxeles sobre canvas con behaviors combinables: `hover` (proximity lighting), `idle` (autonomous blink), `reveal` (dithered pixel reveal)
  - `TiltCard` — card con efecto 3D tilt basado en WAAPI, expone estado via render prop
- **Build tree-shakeable** con `tsup` (ESM + CJS), cada componente importable individualmente
- **Compatibilidad con Tailwind** via `className` prop y namespace `--aui-*` para CSS custom properties
- **Soporte de `prefers-reduced-motion`** en todos los componentes por defecto
- **Archivos de ejemplo copy-paste** listos para copiar y extender sin depender del paquete

## Capabilities

### New Capabilities

- `project-setup`: Estructura del monorepo, configuración de tsup, package.json, TypeScript, y pipeline de publish a npm
- `css-injection`: Sistema de inyección de estilos en runtime (keyframes + CSS vars base) sin imports requeridos del consumer
- `animated-background`: Componente `AnimatedBackground` con variantes aurora/mesh/noise/beam, API de props + CSS custom properties
- `pixel-background`: Componente `PixelBackground` sobre canvas con sistema de behaviors combinables (hover/idle/reveal) y API de theming funcional
- `tilt-card`: Componente `TiltCard` con efecto 3D via WAAPI, render prop para exponer estado de animación

### Modified Capabilities

## Impact

- **Dependencias nuevas (dev):** `tsup`, `typescript`, `react`, `react-dom` (peer deps)
- **Dependencias de runtime:** cero — el paquete no agrega ninguna dependencia al bundle del consumer
- **Compatibilidad:** React 18+, Vite 4+, Next.js 13+ (App Router con `'use client'`), Astro 3+ (como island con `client:load`)
- **CSS:** Variables con namespace `--aui-*` para evitar colisiones con Tailwind v4 (`--tw-*`) y otras librerías
- **SSR:** Todos los accesos a DOM están guardados con `useEffect` y checks de `typeof window`

---

## Hoja de Ruta

Esta es la visión completa del proyecto. El primer change (`animated-ui-foundation`) implementa la base.

### v0.1 — Foundation (este change)
- [ ] Setup del proyecto: tsup, TypeScript, estructura de carpetas
- [ ] Sistema de CSS injection
- [ ] `AnimatedBackground` con variantes: aurora, mesh, noise, beam
- [ ] `PixelBackground` canvas con behaviors: hover, idle, reveal
- [ ] `TiltCard` con WAAPI + render prop
- [ ] Archivos de ejemplo copy-paste

### v0.2 — Interaction Layer
- [ ] `MagneticButton` — botón con efecto magnético que conserva momentum
- [ ] `TrailCursor` — cursor con trail animado
- [ ] `ScrollReveal` — wrapper que revela contenido al hacer scroll (reemplaza AOS/GSAP)
- [ ] `Spotlight` — efecto spotlight que sigue al mouse dentro de un container

### v0.3 — Text Animations
- [ ] `TypewriterText` — efecto de escritura con cursor configurable
- [ ] `GradientText` — texto con gradiente animado
- [ ] `BlurReveal` — texto que aparece desde blur
- [ ] `CountUp` — números que se animan al entrar en viewport

### v0.4 — Advanced Backgrounds
- [ ] `ParticleField` — sistema de partículas canvas, configurable
- [ ] `WaveBackground` — ondas SVG animadas
- [ ] `GridBackground` — grid de líneas con efecto de perspectiva
- [ ] Soporte para backgrounds compuestos (stacking de capas)

### v0.5 — Tailwind Plugin
- [ ] `@fethabo/animated-ui/tailwind` — plugin que expone utilidades de Tailwind
- [ ] Variantes: `animate-aui-aurora`, `aui-pixel-hover`, etc.
- [ ] CLI tipo shadcn: `npx @fethabo/animated-ui add pixel-background`

### v1.0 — Stable Release
- [ ] Documentación completa en sitio propio
- [ ] Playground interactivo
- [ ] Tests de performance comparativos vs Aceternity
- [ ] Guía de migración desde Aceternity UI
