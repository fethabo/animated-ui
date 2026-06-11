# Proposal: tier-2-text-effects

## Why

El roadmap define la tanda v0.3 (Tier 2) como la apertura de la categoría de efectos de texto: `ShinyText` y `ScrambleText`. No requiere ninguna decisión arquitectónica nueva — ShinyText es CSS puro con keyframes inyectados y ScrambleText usa RAF con estado, ambos motores ya establecidos en la foundation. Es la tanda de menor costo restante del roadmap y diversifica el paquete más allá de contenedores y backgrounds.

## What Changes

- Nuevo componente `ShinyText`: brillo que barre el texto en loop, implementado con `background-clip: text` y keyframes inyectados. CSS puro, cero JS por frame. El gradiente es customizable, lo que cubre de facto el caso de uso de `GradientText` (el roadmap ya anticipa esa fusión como variantes).
- Nuevo componente `ScrambleText`: el texto se "descifra" carácter por carácter (efecto decrypt/Matrix), implementado con `requestAnimationFrame` y estado React. Sin DOM pesado: un solo nodo de texto.
- Dos ejemplos standalone nuevos en `/examples` (uno por componente, sin importar el paquete).
- Documentación de los dos componentes en el README (tabla de componentes, props, CSS custom properties).
- Actualización de la tabla del ROADMAP (estado de Tier 2).

Sin breaking changes: solo se agregan exports nuevos a `src/index.ts`.

**Fuera de alcance de este change**: bump de versión y actualización del CHANGELOG — los maneja el usuario con tagman después de la implementación.

## Capabilities

### New Capabilities

- `shiny-text`: texto con brillo que lo barre en loop, con gradiente, velocidad y dirección customizables via props y `--aui-shiny-*`. Cubre también texto con gradiente estático/animado como variante.
- `scramble-text`: texto que se revela carácter por carácter con caracteres aleatorios intermedios, con velocidad, charset y trigger customizables via props y `--aui-scramble-*`.

### Modified Capabilities

(ninguna — los componentes existentes no cambian su comportamiento; el README solo suma secciones nuevas, ya contemplado por los requirements existentes de `readme-docs` y `component-authoring`)

## Impact

- **Código nuevo**: `src/components/ShinyText/`, `src/components/ScrambleText/`; exports en `src/index.ts`.
- **Reutiliza**: `injectStyles`, `useReducedMotion`; patrón de keyframes inyectados de `AnimatedBackground`/`GlowBorder` y RAF de `PixelBackground`.
- **Docs**: README (dos secciones nuevas + dos filas en la tabla), `/examples` (dos archivos nuevos), ROADMAP (estado).
- **Sin dependencias nuevas**: todo con APIs nativas (CSS, RAF), conforme a `component-authoring`.
- **Accesibilidad**: ScrambleText muta el texto visible durante la animación → el contenedor expone `aria-label` con el texto final y los caracteres intermedios quedan ocultos a lectores de pantalla.
- **Verificación**: tests vitest para lógica pura (generador de keyframes, scrambler) + verificación visual en `test-app`.
- **Versionado**: excluido — tagman (a cargo del usuario).
