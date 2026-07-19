# add-behavior-hooks

## Why

Hoy el único modo de consumo de la librería es el componente wrapper: la librería posee el elemento root del DOM y el consumer pone sus children adentro. Eso impide aplicar los efectos sobre componentes de otros design systems (MUI, Chakra, Mantine, o markup propio) sin introducir un `<div>` extra que interfiere con el layout y el styling del consumer. Los cuatro efectos de la familia pointer/WAAPI (TiltCard, MagneticElement, SpotlightCard, GlowBorder) ya son imperativos sobre refs y no re-renderizan por frame: son los candidatos naturales para un segundo modo de consumo por hook, genérico (funciona con cualquier componente que forwardee `ref` a un nodo DOM), sin acoplar la librería a ninguna UI library externa.

## What Changes

- Nuevos hooks públicos `useTilt`, `useMagnetic`, `useSpotlight` y `useGlowBorder`: cada uno recibe un objeto de opciones (espejo de las props del componente homólogo) y devuelve un callback ref para engancharse al elemento del consumer.
- Contrato común de "mejorar y restaurar": el hook opera sobre el elemento del host (setea CSS vars, clases con namespace `aui-`, fuerza `position: relative` solo si el host es `static`, e inyecta capas hijas `aria-hidden` cuando el efecto las necesita) y al desmontar restaura el host a su estado original.
- Los componentes existentes pasan a ser wrappers finos sobre el motor compartido: una sola implementación del comportamiento, dos modos de consumo. La API pública y el DOM renderizado de los cuatro componentes NO cambian (no breaking).
- Actualización de opciones en vivo: cambiar las opciones del hook re-aplica CSS vars sin reconstruir listeners ni capas cuando el cambio es solo de estética.
- Documentación (README + docs site) y verificación en `test-app` del modo hook.

## Capabilities

### New Capabilities

- `behavior-hooks`: contrato común de los hooks de comportamiento — callback ref, enhance-and-restore del host, SSR-safety, `respectReducedMotion`, actualización de opciones en vivo, y límites (qué efectos califican para modo hook y cuáles no).

### Modified Capabilities

- `tilt-card`: el comportamiento tilt SHALL ser consumible via `useTilt` sobre un elemento del consumer; el componente delega en el mismo motor. En modo hook la perspectiva se aplica como `transform: perspective()` en el propio elemento (sin wrapper externo) y `glare` no está disponible.
- `magnetic-element`: el comportamiento magnético SHALL ser consumible via `useMagnetic`; el área de atracción extendida (`hitArea`) se resuelve sin el wrapper de padding del componente.
- `spotlight-card`: el spotlight SHALL ser consumible via `useSpotlight`; el hook inyecta el overlay como hija del host y lo remueve al desmontar.
- `glow-border`: el glow SHALL ser consumible via `useGlowBorder`; el hook inyecta la capa cónica y documenta el contrato del host (padding perimetral y contenido con background propio).

## Impact

- **Código nuevo**: motor por efecto en `src/components/<Nombre>/` (módulo `use-<efecto>.ts` co-locado) + reexports en `src/index.ts`; posible helper compartido de enhance-and-restore en `src/utils/` o `src/hooks/`.
- **Código modificado**: `index.tsx` de TiltCard, MagneticElement, SpotlightCard y GlowBorder (pasan a consumir el motor compartido; DOM y props sin cambios).
- **Sin cambios**: `package.json` (cero deps nuevas), CSS injection (`injectStyles` se reutiliza), subpath exports (los hooks viajan en el chunk de su componente).
- **Docs/verificación**: README (nueva sección de hooks), docs site, demos en `test-app`, tests vitest (incluyendo `*.ssr.test.ts` para cada hook).
- **Riesgo principal**: la refactorización de los 4 componentes debe preservar el comportamiento actual pixel-perfect; se apoya en los tests existentes y verificación visual en `test-app`.
