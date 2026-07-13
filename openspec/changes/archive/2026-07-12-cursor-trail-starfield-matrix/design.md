## Context

Wave K agrupa cinco componentes que solo aplican motores existentes: canvas+RAF con física/geometría en módulos puros (ParticleField, FlowField), capa estática offscreen (CircuitBackground), CSS vars runtime por mousemove (SpotlightCard), nodos efímeros autolimpiados (RippleContainer, Wave E) y `prng.ts`. No hay decisión arquitectónica nueva; este design fija los contratos finos donde hay más de una opción razonable.

## Goals / Non-Goals

**Goals:**

- Tres efectos de cursor (CursorTrail, CustomCursor, ImageTrail) y dos fondos temáticos (StarfieldBackground, MatrixRain) cumpliendo `component-authoring`.
- Fondos deterministas y seedables (mismo contrato `seed` que CircuitBackground/WavesBackground).
- Política de reduced motion coherente con el precedente del paquete: efectos con movimiento decorativo autónomo se desactivan; el input directo puro puede permanecer.

**Non-Goals:**

- CustomCursor no oculta el cursor a nivel documento ni usa portales: su alcance es su contenedor.
- Sin soporte touch para los efectos de cursor (no hay puntero persistente): degradan a no-op.
- MatrixRain no reproduce glifos katakana espejados exactos de la película; charset configurable con default ASCII/katakana simple.

## Decisions

### 1. CursorTrail: canvas overlay con emisión por distancia, dos modos

Un solo componente con `mode: 'particles' | 'line'`. El movimiento del mouse encola puntos de emisión solo si la distancia acumulada supera un umbral (`emitEvery` px) — evita saturar el pool en movimientos rápidos. `particles`: pool con vida/fade/drift (física en módulo puro). `line`: polyline de los últimos N puntos con grosor/alpha decreciente, redibujada por frame. Alternativa considerada: nodos DOM efímeros — rechazada para el trail continuo (decenas de nodos por segundo; canvas es la convención para pools).

**Reduced motion**: el trail se desactiva (es decoración de movimiento, no feedback funcional), coherente con la política de Tier 5.

### 2. CustomCursor: CSS vars runtime + lag por transition, sin canvas

Dot y ring son dos nodos fijos posicionados con `translate` desde `--aui-cursor-x/y` (patrón SpotlightCard: cero re-renders). El lag del anillo se logra con `transition` de distinta duración (dot inmediato, ring con `ease`), no con RAF propio. Estados: `data-aui-cursor-state="idle|hover|down"` — el estado `hover` se detecta con un listener delegado (`pointerover` + `closest('a, button, [role=button], [data-aui-cursor]')`). `hideNativeCursor` (default `true`) aplica `cursor: none` **solo al contenedor**. Guardas: si el dispositivo no reporta `(hover: hover) and (pointer: fine)`, el componente no monta los nodos ni toca el cursor nativo.

**Reduced motion**: se conserva el dot que sigue al puntero sin lag ni transiciones (respuesta 1:1 a input directo, precedente SpotlightCard), pero se elimina el lag elástico del ring (movimiento inferido, no directo).

### 3. ImageTrail: nodos DOM efímeros, no canvas

A diferencia de CursorTrail, acá cada elemento es una **imagen** con su ciclo de vida corto (aparece → flota → se desvanece): pocos nodos concurrentes (~5–10), y el consumer las quiere estilizables (border-radius, sombras). Nodos `<img>` efímeros autolimpiados en `animationend` (patrón RippleContainer) con keyframes inyectados, rotando el array `images` secuencialmente y emitiendo por umbral de distancia. Alternativa canvas `drawImage` — rechazada: pierde estilado CSS y carga/decodifica igual las imágenes.

### 4. StarfieldBackground: campo estático offscreen + overlays dinámicos

Las estrellas (posición, radio, fase de titileo) se generan con `prng(seed)` y se pintan a un offscreen al montar/resize (patrón CircuitBackground). Por frame solo se compone: offscreen + titileo (alpha senoidal por estrella, fase precomputada) + estrellas fugaces (spawn aleatorio con intervalo medio configurable, trazo con gradiente que decae). Reduced motion: se pinta el campo estático sin titileo ni fugaces (precedente: fondos canvas muestran frame estático).

### 5. MatrixRain: estado por columna + veladura, tipografía del sistema

Una columna = un cursor vertical con velocidad y posición; por frame se dibuja el glifo nuevo en la cabeza (color brillante) y una veladura `fillRect` semitransparente sobre todo el canvas desvanece los anteriores (patrón FlowField — el trail es gratis). Glifos elegidos por PRNG del `charset`. La grilla deriva de `fontSize`; `fillText` con `font` monospace del sistema seteado una vez. Reduced motion: frame estático con algunas columnas pre-dibujadas a distintas alturas.

### 6. Contrato común de fondos: mismo shape que Wave H

`StarfieldBackground` y `MatrixRain` siguen el contrato de los fondos canvas existentes: `absolute inset:0` (o `fixed`), `seed`, `colors`/`color`, `density`, `speed`, `className`/`style`, resize por `useResizeObserver` con regeneración determinista.

## Risks / Trade-offs

- [CustomCursor sobre elementos con `cursor` CSS propio (inputs de texto)] → `hideNativeCursor` solo aplica al contenedor y es opt-out; documentado que conviene no envolver formularios completos.
- [ImageTrail con imágenes pesadas puede causar jank de decode en la primera emisión] → pre-carga de las `images` al montar (Image() en efecto, no en render); documentado.
- [MatrixRain a pantalla completa en gama baja] → densidad de columnas derivada del ancho con cap; `fontSize` mayor = menos columnas; documentado como palanca de performance.
- [Trail/cursor en iframes o zonas con `pointer-events:none`] → el tracking usa `useMousePosition` sobre el contenedor; fuera de él, el efecto simplemente se pausa (comportamiento aceptado).
- [Doble cursor si el consumer anida dos CustomCursor] → sin registro global por convención del paquete; documentado como responsabilidad del consumer.

## Migration Plan

Cambio aditivo; sin migración para consumers. Rollback = no publicar los exports nuevos.

## Open Questions

- Ninguna bloqueante. El default exacto de `emitEvery` (CursorTrail/ImageTrail) se calibra visualmente en `test-app` durante la implementación.
