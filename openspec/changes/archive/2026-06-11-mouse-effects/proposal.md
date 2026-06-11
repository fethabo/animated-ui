# Proposal: mouse-effects

## Why

El paquete tiene tres componentes fundacionales y una hoja de ruta aprobada (ROADMAP.md). La tanda v0.2 es la de mejor relación valor/costo: tres efectos de mouse sobre contenedores que reutilizan los motores ya existentes (WAAPI con momentum, CSS injection, `useMousePosition`) sin ninguna decisión arquitectónica nueva. Son además los efectos más demandados en landings modernos (estilo Vercel/Linear), lo que amplía el atractivo del paquete de forma inmediata.

## What Changes

- Nuevo componente `SpotlightCard`: gradiente radial que sigue al cursor dentro del contenedor, iluminando la zona bajo el mouse. CSS custom properties actualizadas por `mousemove`, casi cero JS por frame. Componible con `TiltCard`.
- Nuevo componente `GlowBorder`: borde con gradiente cónico animado, en loop autónomo o apuntando hacia el cursor. `conic-gradient` + `@property` para animar el ángulo.
- Nuevo componente `MagneticElement`: wrapper que atrae su contenido hacia el cursor al acercarse, con retorno elástico al salir. Mismo patrón WAAPI-con-momentum de `TiltCard`, aplicado a `translate`.
- Tres ejemplos standalone nuevos en `/examples` (uno por componente, sin importar el paquete).
- Documentación de los tres componentes en el README (tabla de componentes, props, CSS custom properties).
- Versión del paquete pasa a `0.2.0`.

Sin breaking changes: solo se agregan exports nuevos a `src/index.ts`.

## Capabilities

### New Capabilities

- `spotlight-card`: contenedor con spotlight radial que sigue al cursor, con radio, color e intensidad customizables via props y `--aui-spotlight-*`.
- `glow-border`: contenedor con borde de gradiente cónico animado, en modo loop autónomo o reactivo al cursor, customizable via props y `--aui-glow-*`.
- `magnetic-element`: wrapper magnético que desplaza su contenido hacia el cursor con retorno elástico, customizable via props y `--aui-magnetic-*`.

### Modified Capabilities

(ninguna — los componentes existentes no cambian su comportamiento; el README solo suma secciones nuevas, lo que ya está contemplado por los requirements existentes de `readme-docs` y `component-authoring`)

## Impact

- **Código nuevo**: `src/components/SpotlightCard/`, `src/components/GlowBorder/`, `src/components/MagneticElement/`; exports en `src/index.ts`.
- **Reutiliza**: `injectStyles`, `useMousePosition`, `useReducedMotion`; patrón WAAPI de `TiltCard`.
- **Docs**: README (tres secciones nuevas + tres filas en la tabla), `/examples` (tres archivos nuevos).
- **Sin dependencias nuevas**: todo con APIs nativas (CSS, WAAPI), conforme a `component-authoring`.
- **Verificación**: tests vitest para lógica pura + verificación visual en `test-app`.
