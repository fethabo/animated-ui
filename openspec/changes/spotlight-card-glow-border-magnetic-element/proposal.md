# Proposal: spotlight-card-glow-border-magnetic-element

## Why

El paquete tiene tres componentes fundacionales y una suite de scroll completa (v0.3–v0.5 archivados). La tanda v0.2 completa el Tier 1 del roadmap con la mejor relación valor/costo de toda la hoja de ruta: `SpotlightCard`, `GlowBorder` y `MagneticElement` son los efectos de mouse sobre contenedores más demandados en UIs modernas (estilo Vercel/Linear), y reutilizan íntegramente los motores ya existentes — WAAPI con momentum de `TiltCard`, CSS injection via `injectStyles`, patrón de CSS vars por `mousemove` — sin ninguna decisión arquitectónica nueva. Alta ganancia visual con riesgo arquitectónico nulo.

## What Changes

- Nuevo componente `SpotlightCard`: gradiente radial que sigue al cursor dentro del contenedor, iluminando la zona bajo el mouse. CSS custom properties actualizadas por `mousemove` (sin re-renders de React); composable con `TiltCard`.
- Nuevo componente `GlowBorder`: borde con gradiente cónico animado en loop autónomo o apuntando hacia el cursor. Implementado con una capa oversized rotada via `transform` (soporte universal; evita la dependencia de `@property`/Houdini para la animación).
- Nuevo componente `MagneticElement`: wrapper que atrae su contenido hacia el cursor al acercarse, con retorno elástico al salir. Mismo patrón WAAPI-con-momentum de `TiltCard`, aplicado a `translate`; expone `MagneticState` via render prop para efectos derivados.
- Tres ejemplos standalone nuevos en `/examples` (uno por componente, sin importar el paquete).
- Documentación de los tres componentes en el README (tabla de componentes, props, CSS custom properties).

Sin breaking changes: solo se agregan exports nuevos a `src/index.ts`.

**Fuera de alcance de este change**: bump de versión y CHANGELOG (los maneja el usuario con tagman); efectos de texto, scroll y canvas (otras tandas).

## Capabilities

### New Capabilities

- `spotlight-card`: contenedor con spotlight radial que sigue al cursor, con radio, color e intensidad customizables via props y `--aui-spotlight-*`.
- `glow-border`: contenedor con borde de gradiente cónico animado, en modo loop autónomo o reactivo al cursor, customizable via props y `--aui-glow-*`.
- `magnetic-element`: wrapper magnético que desplaza su contenido hacia el cursor con retorno elástico, con render prop `MagneticState`, customizable via prop `strength` y `hitArea`.

### Modified Capabilities

(ninguna — los componentes existentes no cambian su comportamiento)

## Impact

- **Código nuevo**: `src/components/SpotlightCard/`, `src/components/GlowBorder/`, `src/components/MagneticElement/`; exports en `src/index.ts`.
- **Reutiliza**: `injectStyles`, `useReducedMotion`; patrón de CSS vars por `mousemove` (hot path sin estado de React); patrón WAAPI con momentum de `TiltCard`.
- **Docs**: README (tres secciones nuevas + tres filas en la tabla), `/examples` (tres archivos nuevos).
- **Sin dependencias nuevas**: todo con APIs nativas (CSS, WAAPI, eventos de mouse), conforme a `component-authoring`.
- **Verificación**: tests vitest para lógica pura (cálculo de ángulo de GlowBorder, cálculo de offset de MagneticElement) + patrón `*.ssr.test.ts` + verificación visual en `test-app`.
- **Versionado**: excluido — bump de versión y CHANGELOG los maneja el usuario con tagman.
