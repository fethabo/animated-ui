# custom-cursor Specification

## Purpose
Componente `CustomCursor`: reemplaza el cursor nativo dentro de su contenedor por un dot que sigue al puntero de inmediato y un ring con lag elástico, posicionados via CSS custom properties (`--aui-cursor-*`) sin estado de React por frame. Reacciona a elementos interactivos exponiendo `data-aui-cursor-state`, solo actúa con puntero fino y hover real, es customizable via props y CSS custom properties, respeta `prefers-reduced-motion` con seguimiento directo sin lag, y es SSR-safe y extensible.

## Requirements

### Requirement: CustomCursor reemplaza el cursor nativo dentro de su contenedor

`CustomCursor` SHALL renderizar un cursor personalizado compuesto por un punto (dot) que sigue al puntero de inmediato y un anillo (ring) que lo sigue con lag elástico, dentro de los límites de su contenedor. El posicionamiento SHALL usar CSS custom properties escritas por `mousemove` (`--aui-cursor-x`/`--aui-cursor-y`) sin estado de React por frame; el lag SHALL resolverse con CSS transitions, sin RAF propio. Con `hideNativeCursor` (default `true`), el cursor nativo SHALL ocultarse **solo dentro del contenedor** (`cursor: none`), sin portales ni efectos a nivel documento.

#### Scenario: Dot y ring siguen al puntero

- **WHEN** el puntero se mueve dentro del contenedor
- **THEN** el dot SHALL posicionarse inmediatamente bajo el puntero y el ring SHALL alcanzarlo con retardo elástico, sin re-renders de React por frame

#### Scenario: Cursor nativo restaurado al salir

- **WHEN** el puntero sale del contenedor
- **THEN** el cursor nativo SHALL verse normalmente fuera del contenedor y el cursor custom SHALL ocultarse

### Requirement: CustomCursor reacciona a elementos interactivos

El componente SHALL detectar por delegación (`pointerover` + `closest('a, button, [role="button"], [data-aui-cursor]')`) cuándo el puntero está sobre un elemento interactivo, y reflejarlo agrandando el ring (estado `hover`). El estado SHALL exponerse como `data-aui-cursor-state="idle" | "hover" | "down"` sobre el root, para estilado custom del consumer. Los elementos marcados con `data-aui-cursor` SHALL participar de la detección aunque no sean links/botones.

#### Scenario: Hover sobre un botón

- **WHEN** el puntero pasa sobre un `<button>` dentro del contenedor
- **THEN** el ring SHALL agrandarse y el root SHALL exponer `data-aui-cursor-state="hover"`

#### Scenario: Pointer down

- **WHEN** el usuario mantiene presionado el botón del mouse
- **THEN** el root SHALL exponer `data-aui-cursor-state="down"` mientras dure la presión

### Requirement: CustomCursor solo actúa con puntero fino y hover real

En dispositivos que no reportan `(hover: hover) and (pointer: fine)` (touch, pointers gruesos), el componente NO SHALL montar los nodos del cursor custom ni ocultar el cursor nativo: los `children` SHALL renderizarse intactos.

#### Scenario: Dispositivo touch

- **WHEN** el media query `(hover: hover) and (pointer: fine)` no matchea
- **THEN** NO SHALL renderizarse dot ni ring y el cursor nativo NO SHALL ocultarse

### Requirement: CustomCursor es customizable

`CustomCursor` SHALL aceptar `dotSize`, `ringSize`, `color`, `lag` (segundos del retardo del ring), `hoverScale` (factor de crecimiento en hover) y `hideNativeCursor`, con CSS custom properties equivalentes (`--aui-cursor-*`) para pisarlas en cascada.

#### Scenario: Customización por props

- **WHEN** el consumer pasa `color="#f0abfc"` y `hoverScale={2}`
- **THEN** dot y ring SHALL renderizarse en ese color y el ring SHALL duplicar su tamaño en hover

### Requirement: CustomCursor respeta prefers-reduced-motion

`CustomCursor` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el dot SHALL seguir al puntero sin transiciones (respuesta 1:1 a input directo) y el lag elástico del ring SHALL eliminarse (ring pegado al dot o oculto).

#### Scenario: Reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** NO SHALL haber movimiento elástico inferido; el seguimiento SHALL ser directo, sin lag

### Requirement: CustomCursor es SSR-safe y extensible

`CustomCursor` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
