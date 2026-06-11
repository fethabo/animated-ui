# Proposal: scroll-reveal-mouse-parallax

## Why

El roadmap define la tanda v0.4 como `ScrollReveal` + `MouseParallax`. Es el primer paso del territorio scroll con la decisión arquitectónica más barata posible: el hook `useInView` (IntersectionObserver) alcanza para reveals al entrar al viewport sin comprometerse todavía con el motor de scroll completo (posición continua), que queda para v0.5 con su propio design. `MouseParallax` cierra además el último pendiente del Tier 1 reutilizando el patrón de CSS vars sin re-renders ya probado en SpotlightCard.

## What Changes

- Nuevo hook público `useInView`: reporta si un elemento referenciado está visible en el viewport via IntersectionObserver, con opciones de threshold, margen y disparo único. SSR-safe.
- Nuevo componente `ScrollReveal`: anima la entrada de su contenido al entrar al viewport (fade + desplazamiento configurable), con stagger entre hijos directos. Usa `useInView` + CSS transitions inyectadas; sin JS por frame.
- Nuevo componente `MouseParallax`: contenedor con capas a distintas profundidades (`MouseParallax.Layer` con prop `depth`) desplazadas según la posición del mouse — parallax creativo sin scroll. El tracking escribe CSS vars directamente sobre el root (patrón SpotlightCard, sin re-renders por frame).
- Dos ejemplos standalone nuevos en `/examples` (uno por componente, sin importar el paquete).
- Documentación de hook y componentes en el README; actualización del ROADMAP (estado de v0.4, Tier 1 y Tier 3).

Sin breaking changes: solo se agregan exports nuevos.

**Fuera de alcance de este change**: bump de versión y CHANGELOG (los maneja el usuario con tagman); motor de scroll de posición continua (`ParallaxLayers`/`ScrollProgress`, v0.5); `StickyScenes` (v0.6+).

## Capabilities

### New Capabilities

- `use-in-view`: hook que reporta la visibilidad de un elemento en el viewport via IntersectionObserver, con `threshold`, `rootMargin` y modo `once`; SSR-safe y con fallback seguro si el browser no soporta IntersectionObserver.
- `scroll-reveal`: contenedor que revela su contenido al entrar al viewport con dirección, distancia, duración y stagger customizables via props y `--aui-reveal-*`.
- `mouse-parallax`: contenedor de capas con profundidad que se desplazan según el mouse, customizable via props y `--aui-parallax-*`, sin re-renders de React por frame.

### Modified Capabilities

(ninguna — los componentes y hooks existentes no cambian su comportamiento)

## Impact

- **Código nuevo**: `src/hooks/useInView.ts`, `src/components/ScrollReveal/`, `src/components/MouseParallax/`; exports en `src/index.ts`, entries en tsup y subpaths en `package.json`.
- **Reutiliza**: `injectStyles`, `useReducedMotion`; patrón de CSS vars por mousemove de SpotlightCard. No reutiliza `useMousePosition` (pasa por estado de React → re-render por frame, anti-patrón para el hot path).
- **Docs**: README (hook + dos componentes), `/examples` (dos archivos), ROADMAP (estados).
- **Sin dependencias nuevas**: IntersectionObserver, CSS transitions y mousemove son APIs nativas, conforme a `component-authoring`.
- **Trade-off a documentar**: el contenido de ScrollReveal se renderiza oculto hasta hidratar + intersecar (sin flash); el texto sigue en el DOM para SEO/crawlers. Ver design.
- **Verificación**: tests vitest para lógica pura y SSR + verificación visual en `test-app`.
- **Versionado**: excluido — tagman (a cargo del usuario).
