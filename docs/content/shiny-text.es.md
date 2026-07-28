---
title: ShinyText
description: Texto con una franja de brillo que lo barre en loop — CSS puro, cero JS por frame.
---

## Características

- CSS puro: el gradiente se clipea a los glifos con `background-clip: text` y se desplaza animando `background-position` — cero JS por frame.
- Con colores custom de base y brillo funciona también como texto con gradiente animado.
- El texto sigue siendo texto real: seleccionable, copiable y legible por lectores de pantalla.
- Renderiza un `<span>`; el heading o párrafo lo ponés vos envolviéndolo.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-shiny-color` | `#71717a` | Color base del texto. |
| `--aui-shiny-highlight` | `#fafafa` | Color de la franja de brillo. |
| `--aui-shiny-speed` | `3s` | Duración de un barrido del loop. |
| `--aui-shiny-angle` | `120deg` | Dirección del gradiente/barrido. |

## CSS Class Mode (Zero-JS)

ShinyText soporta el uso nativo mediante clases HTML estáticas y su CSS exportado.

```html
<link rel="stylesheet" href="node_modules/@fethabo/animated-ui/dist/css/shiny-text.css" />

<span class="aui-shiny">Brillo puro CSS</span>
```

O podés registrarlo dinámicamente con JavaScript (ideal si querés ahorrar importaciones CSS a nivel global pero seguir sin usar componentes React en el nodo):

```javascript
import { registerShinyText } from '@fethabo/animated-ui'
// Inyecta el CSS en el <head> (idempotente)
registerShinyText()
```

**Accesibilidad (Opt-out):** El modo CSS detiene el barrido automáticamente con `prefers-reduced-motion` a nivel de CSS nativo. Si requerís forzar la animación saltando esta configuración, añadí `data-aui-motion` al nodo: `<span class="aui-shiny" data-aui-motion>...</span>`.

## Limitaciones

- Depende de `background-clip: text` (soportado en todos los browsers modernos).
- Con `prefers-reduced-motion` el barrido se detiene y queda el gradiente estático.
