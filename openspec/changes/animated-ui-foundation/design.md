## Context

Proyecto nuevo desde cero. No hay código existente, solo el scaffolding de OpenSpec. El objetivo es establecer la arquitectura fundamental del paquete `@fethabo/animated-ui` y entregar los tres primeros componentes: `AnimatedBackground`, `PixelBackground`, y `TiltCard`.

Las decisiones técnicas centrales emergen de tres constraints:
1. **Cero dependencias de runtime** — el consumer no debe pagar overhead de Framer Motion ni ninguna lib de animación
2. **Zero-config para el consumer** — instalar el paquete y usar el componente debe ser suficiente, sin imports de CSS
3. **Framework compatibility** — React 18+ corriendo en Vite, Next.js App Router, y Astro

## Goals / Non-Goals

**Goals:**
- Estructura de paquete lista para publicar en npm como `@fethabo/animated-ui`
- Sistema de CSS injection que no requiere imports del consumer
- `AnimatedBackground` con variantes CSS-puras (aurora, mesh, noise, beam)
- `PixelBackground` canvas-based con behaviors combinables
- `TiltCard` con WAAPI y render prop para estado de animación
- Soporte de `prefers-reduced-motion` en todos los componentes
- Ejemplos copy-paste en `/examples`

**Non-Goals:**
- CLI tipo shadcn (roadmap v0.5)
- Tailwind plugin (roadmap v0.5)
- Soporte Vue/Svelte/framework-agnostic (roadmap post-v1)
- Documentación en sitio web (roadmap v1.0)
- Más de tres componentes en este change

## Decisions

### D1: CSS Injection en runtime sobre Vanilla Extract o stylesheet import

**Decision:** Inyectar `<style>` tags via `useEffect` al montar cada componente.

**Por qué no Vanilla Extract:** VE requiere un build plugin en el proyecto del consumer (Next, Vite, Astro cada uno tiene su plugin). Aunque el output final es CSS estático, agrega fricción de setup que contradice el goal de zero-config.

**Por qué no `import './styles.css'`:** Requiere que el bundler del consumer maneje CSS imports. En algunos setups de Astro y SSR esto puede romper. Más importante: el dev tiene que recordar hacer el import.

**Cómo funciona:**
```
injectStyles(id: string, css: string)
  → if (document.getElementById(id)) return  // deduplicación
  → crea <style id={id}> y lo appenda a <head>
```

Llamado dentro de `useEffect(() => { injectStyles(...) }, [])` — nunca en SSR.

Los CSS custom properties con defaults se setean como inline styles en el root del componente para que sean overrideables por el consumer via CSS.

### D2: Canvas para PixelBackground, CSS puro para AnimatedBackground

**Decision:** `PixelBackground` usa `<canvas>` con `requestAnimationFrame`. `AnimatedBackground` usa un `<div>` con CSS `@keyframes` inyectados.

**Por qué Canvas para Pixel:** Una grilla de 80×50 = 4000 elementos DOM. Cada celda con un event listener de proximidad = death. Canvas renderiza todas las celdas en una pasada de pintura. Para behaviors combinables (hover + idle + reveal corriendo simultáneamente), el modelo de "acumular contributions por frame" es natural en canvas y torpe en DOM.

**Por qué CSS para AnimatedBackground:** Los backgrounds (aurora, mesh, etc.) son esencialmente gradientes animados. CSS keyframes los manejan perfectamente a 60fps sin JS. SSR-safe porque el CSS se inyecta en cliente pero el fallback (div sin animación) renderiza limpio.

### D3: WAAPI para TiltCard sobre CSS transforms + mouse events

**Decision:** Usar Web Animations API (`element.animate()`) para el tilt 3D.

**Por qué:** WAAPI permite interpolar suavemente entre el estado actual y el target angle, preservando momentum. Con CSS transitions puras hay un "snap" al cambiar de dirección. WAAPI es nativo del browser, zero bytes de JS de lib externa.

**Render prop:** `TiltCard` acepta children como función `(state) => ReactNode` donde `state = { tiltX, tiltY, isHovering }`. Esto permite al dev construir efectos adicionales sobre el tilt (parallax layers, color shifts) sin tocar el source.

### D4: tsup como build tool

**Decision:** `tsup` para compilar TypeScript a ESM + CJS con tree-shaking.

**Por qué:** tsup está basado en esbuild, cero config para el caso common (entry points → dist/), genera `.d.ts` automáticamente, soporta múltiples entry points para tree-shaking por componente.

**Output:** `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts`.

### D5: Namespace `--aui-*` para CSS Custom Properties

**Decision:** Todas las CSS custom properties usan el prefijo `--aui-`.

**Por qué:** Tailwind v4 usa `--tw-*`. shadcn usa `--radius`, `--background`, etc. `--aui-*` es único y descriptivo. Ejemplos: `--aui-aurora-color-1`, `--aui-pixel-size`, `--aui-tilt-max-angle`.

### D6: Directive `'use client'` en todos los componentes

**Decision:** Todos los archivos de componente incluyen `'use client'` como primera línea.

**Por qué:** Estos componentes son inherentemente del lado cliente (DOM, eventos, canvas). En Next.js App Router, sin esta directiva un Server Component intentaría renderizarlos y fallaría. En Vite y Astro la directiva es ignorada (es solo un string en el módulo).

## Risks / Trade-offs

**CSS injection race condition en SSR** → Los styles no existen hasta que hydrata el cliente. Durante el SSR el componente renderiza sin animaciones. Para backgrounds y efectos decorativos esto es aceptable (no hay CLS de contenido, solo ausencia de animación hasta hydration).

**Canvas no respeta CSS theming** → A diferencia de los backgrounds CSS, el canvas de PixelBackground no puede ser estilizado con CSS. La solución es el callback `cellColor: (x, y, proximity, phase) => string` que expone todo el control al dev. Riesgo: API más compleja que una CSS var.

**WAAPI soporte en browsers** → WAAPI está disponible en todos los browsers modernos (Chrome 36+, Firefox 48+, Safari 13.1+). Edge cases con compositing en Safari pueden requerir ajustes.

**`prefers-reduced-motion`** → Se lee con `window.matchMedia` en un hook. Si el usuario cambia la preferencia después de montar, el componente no reacciona en tiempo real (solo relee en mount). Para v0.1 esto es aceptable.

## Open Questions

- ¿El sistema de CSS injection debe exponer una forma de pre-cargar los styles (para SSR streaming)? Potencial v0.2 feature.
- ¿Los ejemplos copy-paste en `/examples` deben ser TypeScript o JavaScript? → TypeScript, alineado con el resto del paquete.
