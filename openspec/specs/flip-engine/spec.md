# flip-engine Specification

## Purpose
Motor FLIP (First-Last-Invert-Play) interno y reutilizable que anima cambios de layout reales (reordenamientos, entradas/salidas, cambios de tamaño) entre renders de React, sin re-renders por frame. Provee un módulo puro de cálculo (`src/utils/flip.ts`) y un helper de play sobre WAAPI con cancelación/encadenado sin saltos. No se expone como API pública del paquete; lo consumen internamente `AnimatedList` y `AutoHeight`.

## Requirements

### Requirement: El motor FLIP calcula inversiones en módulo puro

El paquete SHALL proveer un módulo puro interno (`src/utils/flip.ts` o equivalente) con la lógica FLIP: dado un par de rects (First/Last), calcular el delta de inversión (traslación y, opcionalmente, escala) y clasificar conjuntos de keys entre dos renders en entradas, salidas y persistentes. El módulo NO SHALL depender del DOM y SHALL ser testeable con rects sintéticos.

#### Scenario: Delta de inversión

- **WHEN** un elemento se movió de la posición (0,0) a la (100,50) entre commits
- **THEN** el cálculo SHALL producir una inversión de (-100,-50) para partir visualmente desde su posición anterior

#### Scenario: Clasificación de keys

- **WHEN** se comparan las keys `[a,b,c]` (anterior) con `[b,c,d]` (nuevo)
- **THEN** el diff SHALL clasificar `d` como entrada, `a` como salida y `b`,`c` como persistentes

### Requirement: El motor FLIP anima con WAAPI antes del paint

Las animaciones FLIP SHALL lanzarse con `element.animate()` en `useLayoutEffect` (después del layout nuevo, antes del paint): el usuario NO SHALL ver el salto de posición sin animar. El motor NO SHALL usar estado de React por frame ni provocar re-renders por animación.

#### Scenario: Sin salto visible

- **WHEN** un cambio de orden ocurre entre renders
- **THEN** los elementos SHALL partir visualmente de sus posiciones anteriores y deslizarse a las nuevas

### Requirement: El motor FLIP maneja interrupciones sin saltos

Si un cambio nuevo ocurre con animaciones FLIP en vuelo, el motor SHALL cancelar las animaciones activas del elemento partiendo desde su posición visual actual: el nuevo FLIP SHALL encadenarse sin saltos ni parpadeos. El rastreo de animaciones por elemento SHALL ser local a la instancia (sin registro global).

#### Scenario: Reorden durante animación

- **WHEN** la lista se reordena de nuevo antes de que termine la animación anterior
- **THEN** los elementos SHALL redirigirse suavemente desde su posición actual hacia la nueva, sin teletransportarse
