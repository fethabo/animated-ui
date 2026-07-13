## Why

SVG es un motor nativo completo que el paquete no explota: la técnica de line-drawing (`stroke-dasharray`/`stroke-dashoffset` animado con CSS, cero JS por frame) habilita una estética "hand-drawn" que ningún componente actual puede producir, y es el efecto de landing de moda (subrayados de marcador, garabatos, SVGs que se dibujan solos). Una sola decisión de motor rinde tres componentes — la misma economía que `noise.ts` en Wave H.

## What Changes

- **Nuevo motor SVG stroke** (decisión arquitectónica → design.md propio): medir paths con `getTotalLength()`, setear `stroke-dasharray`/`stroke-dashoffset` y animarlos a 0 con keyframes inyectados via `injectStyles`; generación **procedural y seedable** de paths hand-drawn (jitter via `prng.ts`) en módulos puros testeables.
- **Nuevo `TextHighlighter`**: marcador que subraya/resalta/encierra/tacha la palabra envuelta al entrar al viewport (`useInView`), con temblor a mano alzada. Shapes: `underline` / `circle` / `highlight` / `strike` / `box`. SVG overlay absolutamente posicionado que no altera el flujo del texto.
- **Nuevo `DrawPath`**: wrapper genérico — cualquier SVG del consumer se "dibuja" trazo a trazo al entrar al viewport, con stagger entre paths y dirección configurable. El SVG del consumer no se modifica estructuralmente: solo se miden sus paths y se les aplican las vars de dash.
- **Nuevo `ScribbleDecoration`**: garabatos decorativos animados (flecha, asterisco, espiral, subrayado ondulado, círculo), procedurales y seedables, como biblioteca de shapes **extensible** (contrato común tipo `aesthetics/` de GuidingBranches).

## Capabilities

### New Capabilities

- `svg-stroke-engine`: Primitiva interna de line-drawing — medición de paths, vars de dash, keyframes inyectados y generación procedural seedable de paths hand-drawn.
- `text-highlighter`: Componente `TextHighlighter` — resaltado hand-drawn animado de texto inline al entrar al viewport.
- `draw-path`: Componente `DrawPath` — line-drawing genérico de SVGs provistos por el consumer.
- `scribble-decoration`: Componente `ScribbleDecoration` — garabatos decorativos procedurales animados con shapes extensibles.

### Modified Capabilities

<!-- Ninguna. -->

## Impact

- **Código nuevo**: `src/utils/svg-stroke.ts` (o equivalente) + `src/utils/hand-drawn.ts` (paths procedurales, módulo puro con tests); `src/components/TextHighlighter/`, `src/components/DrawPath/`, `src/components/ScribbleDecoration/`.
- **Exports**: tres componentes y sus tipos desde `src/index.ts` + tres entry points en `package.json#exports` y `tsup.config.ts` (las utils quedan internas, como `noise.ts`).
- **Docs**: tres secciones en README, tres ejemplos standalone en `/examples`, tres demos con panel de controles en `test-app`; fila nueva en la tabla de motores del ROADMAP (ya agregada como ⬜).
- **Dependencias**: ninguna nueva (criterio no negociable). **Sin breaking changes** (todo aditivo).
