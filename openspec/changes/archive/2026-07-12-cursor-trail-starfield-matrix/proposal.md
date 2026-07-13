## Why

El Tier 5 (cursor) quedó con solo dos componentes pese a tener toda la infraestructura pagada (canvas overlay `pointer-events:none`, `useMousePosition`, `prng.ts`, física en módulo puro), y el Tier 4 tiene dos fondos temáticos de costo casi nulo esperando las mismas primitivas. Wave K agrupa cinco componentes que solo aplican motores y patrones existentes — cero decisiones arquitectónicas nuevas — cubriendo dos estéticas muy demandadas en portfolios/landings (cursor decorativo, fondos estelares/Matrix).

## What Changes

- **Nuevo `CursorTrail`**: estela de partículas o línea fluida que sigue al puntero dentro de su contenedor. Canvas overlay + física en módulo puro (patrón ParticleField); emisión throttleada por distancia recorrida. Modos `particles` / `line`. Se desactiva bajo `prefers-reduced-motion` (movimiento autónomo decorativo).
- **Nuevo `CustomCursor`**: punto + anillo con lag elástico que reemplaza al cursor nativo dentro del contenedor; el anillo se agranda sobre elementos interactivos (delegación via `closest('a, button, [data-aui-cursor]')`). CSS vars runtime por mousemove (patrón SpotlightCard). Restaura el cursor nativo en dispositivos touch / sin hover y bajo reduced motion.
- **Nuevo `ImageTrail`**: imágenes que brotan siguiendo el mouse y se desvanecen (efecto agency/portfolio). Nodos efímeros autolimpiados con pool de imágenes rotado secuencialmente; emisión por umbral de distancia.
- **Nuevo `StarfieldBackground`**: cielo estrellado vivo — estrellas titilando asíncronas + estrellas fugaces ocasionales, seedable y determinista. Campo de estrellas en capa estática offscreen (patrón CircuitBackground) + titileo/fugaces por frame.
- **Nuevo `MatrixRain`**: lluvia de glifos cayendo por columnas (code rain), seedable, con charset y colores configurables. `fillText` por columna con trail por veladura semitransparente (patrón FlowField).

## Capabilities

### New Capabilities

- `cursor-trail`: Componente `CursorTrail` — estela de partículas/línea que sigue al puntero sobre canvas overlay.
- `custom-cursor`: Componente `CustomCursor` — cursor personalizado punto+anillo con lag y reacción a elementos interactivos.
- `image-trail`: Componente `ImageTrail` — imágenes efímeras que brotan siguiendo el mouse.
- `starfield-background`: Componente `StarfieldBackground` — fondo de cielo estrellado con titileo y estrellas fugaces, seedable.
- `matrix-rain`: Componente `MatrixRain` — fondo de lluvia de glifos por columnas, seedable.

### Modified Capabilities

<!-- Ninguna. -->

## Impact

- **Código nuevo**: `src/components/CursorTrail/`, `src/components/CustomCursor/`, `src/components/ImageTrail/`, `src/components/StarfieldBackground/`, `src/components/MatrixRain/`, cada uno con su física/geometría en módulos puros testeables.
- **Exports**: cinco componentes y sus tipos desde `src/index.ts` + cinco entry points en `package.json#exports` y `tsup.config.ts`.
- **Docs**: cinco secciones en README, cinco ejemplos standalone en `/examples`, cinco demos con panel de controles en `test-app`.
- **Dependencias**: ninguna nueva (criterio no negociable). **Sin breaking changes** (todo aditivo). Reutiliza `useMousePosition`, `useReducedMotion`, `useResizeObserver`, `useInView`, `prng.ts` e `injectStyles` sin modificarlos.
