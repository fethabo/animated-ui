---
title: BorderBeam
description: Cometa de luz que recorre el perímetro del borde del contenedor en loop continuo.
---

## Características

- CSS casi puro (`offset-path: border-box` + `offset-distance` animado), sin JS por frame: una cabeza brillante con estela en degradé recorre el borde en loop.
- Sigue el `border-radius` que le des al componente, incluyendo esquinas redondeadas.
- La capa del cometa es `pointer-events: none`: los clicks pasan al contenido.
- `delay` (negativo arranca "ya avanzado") permite desincronizar múltiples instancias.
- Acepta cualquier prop HTML válida de `<div>` (poné acá el `border-radius`).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-beam-color-from` | `#7c3aed` | Color de la cabeza. Prevalece sobre `colorFrom`. |
| `--aui-beam-color-to` | `#0ea5e9` | Color de la cola. |
| `--aui-beam-size` | `96px` | Largo del cometa. |
| `--aui-beam-duration` | `6s` | Segundos por vuelta. |
| `--aui-beam-delay` | `0s` | Desfase inicial. |
| `--aui-beam-border-width` | `2px` | Grosor del trazo. |

## CSS Class Mode (Zero-JS)

BorderBeam se puede aplicar usando sus clases nativas y su CSS, sin necesidad de usar el componente de React.

```html
<link rel="stylesheet" href="node_modules/@fethabo/animated-ui/dist/css/border-beam.css" />

<div class="aui-border-beam" style="border-radius: 12px;">Contenido</div>
```

También podés registrar sus estilos de manera programática:

```javascript
import { registerBorderBeam } from '@fethabo/animated-ui'
// Inyecta el CSS en el <head> (idempotente)
registerBorderBeam()
```

**Accesibilidad (Opt-out):** El modo CSS de BorderBeam respeta de manera nativa la configuración `prefers-reduced-motion`, deteniendo la animación de forma automática. Si requerís forzar la animación saltándote esta restricción, añadí el atributo `data-aui-motion` al nodo HTML: `<div class="aui-border-beam" data-aui-motion>...</div>`.

## Limitaciones

- En browsers sin `offset-path: border-box` el cometa se oculta sin afectar nada (`@supports`).
- Con `prefers-reduced-motion` muestra un realce de borde estático sutil, sin movimiento.
