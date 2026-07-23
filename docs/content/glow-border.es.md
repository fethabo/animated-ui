---
title: GlowBorder
description: Contenedor con un anillo de borde de gradiente cónico animado, en loop autónomo o apuntando al cursor.
---

## Características

- Por default el gradiente rota en loop; con `followCursor` apunta hacia el cursor con momentum (mismo patrón WAAPI de TiltCard).
- La animación rota una capa con `transform` (corre en el compositor, soporte universal de browsers) en vez de animar el ángulo del gradiente con `@property`.
- El gradiente cubre todo el fondo del wrapper y el contenido lo tapa con su propio background, dejando visible solo el anillo del perímetro. Pasá el background de tu contenido via `contentStyle`/`contentClassName` — si lo ponés en el root via `className`, tapás el anillo.
- Acepta cualquier prop HTML válida de `<div>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-glow-color-1` | `#7c3aed` | Primer color del cónico (violeta). |
| `--aui-glow-color-2` | `#0ea5e9` | Segundo color (cyan). |
| `--aui-glow-color-3` | `#ec4899` | Tercer color (rosa). |
| `--aui-glow-speed` | `4s` | Duración de una rotación del loop. |
| `--aui-glow-width` | `1px` | Ancho del anillo de borde. |
| `--aui-glow-radius` | `12px` | Border-radius exterior. |
| `--aui-glow-opacity` | `1` | Intensidad del glow. |

## Modo hook: `useGlowBorder`

El mismo anillo sobre **tu** elemento: el hook devuelve un callback ref, inyecta la capa cónica como hijo del host y aplica la clase `aui-glow` (padding perimetral = ancho del glow, `overflow: hidden`, `isolation`), restaurando todo al desmontar.

**Contrato del host:** su `padding` pasa a ser el ancho del anillo, y el contenido debe aportar su propio background (y border-radius acorde) para tapar el centro del gradiente — el rol que en el componente cumple el wrapper interno. Si tu elemento no puede ceder su padding, usá el componente.

```tsx
import { useGlowBorder } from '@fethabo/animated-ui/glow-border'

function MiCard() {
  const glowRef = useGlowBorder({ width: 2, radius: 16 })
  return (
    <div ref={glowRef}>
      <div style={{ background: '#12121f', borderRadius: 14, padding: '2rem' }}>Mi contenido</div>
    </div>
  )
}
```

Opciones: `colors`, `speed` (default `4`), `width` (default `1`), `radius` (default `12`), `opacity` (default `1`), `followCursor` (default `false`), `respectReducedMotion` (default `true`).

## Limitaciones

- Con `prefers-reduced-motion` el loop se detiene y queda el gradiente estático; `followCursor` sigue activo por responder a input directo.
- El background del contenido va en el contenedor interno (`contentStyle`/`contentClassName`): ponerlo en el root tapa el anillo.
- En modo hook no hay `contentClassName`/`contentStyle` (el contenido del consumer cumple ese rol) y el hook pisa `padding`/`overflow`/`isolation` del host mientras está atado.
