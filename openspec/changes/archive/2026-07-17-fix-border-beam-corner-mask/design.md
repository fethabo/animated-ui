## Context

`BorderBeam` implementa el cometa como un único nodo rígido (`.aui-border-beam-comet`, píldora de `size × borderWidth` px con el degradé pintado adentro) que viaja con `offset-path: border-box` + `offset-distance` animado. `offset-path` traslada el punto de anclaje (`offset-anchor: 100% 50%`, la cabeza) y rota el elemento entero según la tangente del path en ese punto — pero nunca lo deforma. En las esquinas redondeadas, la tangente de una curva convexa queda por fuera de la curva, así que la estela sobresale recta de la card. La capa (`.aui-border-beam-layer`) tiene `border-radius: inherit` pero ningún clip ni máscara, por lo que lo que sobresale se ve completo.

```
              cola recta sobre la tangente
                 ╲
                  ╲ ← se sale de la card
      ─────────────●╲
     ╭──────────────╲ ● ← cabeza (sí sigue el arco)
     │            ╲   │
     │   card      ╲  │   el path dobla, el elemento no
```

Restricciones vigentes (component-authoring): cero JS por frame en este componente (motor CSS puro), zero-config, degradación limpia via `@supports`, copia standalone en `/examples`.

## Goals / Non-Goals

**Goals:**

- Que el cometa nunca se dibuje fuera del contenedor y que visualmente doble las esquinas siguiendo el `border-radius`.
- Mantener el motor actual: CSS puro, cero JS por frame, sin medir el box ni leer el radius desde JS.
- Degradación limpia en browsers sin soporte (patrón `@supports` ya establecido).
- Misma corrección en la copia standalone `examples/border-beam.tsx`.

**Non-Goals:**

- Doblado geométrico exacto de la estela (requeriría el motor SVG stroke-dash con medición del box y prop `radius` explícita — descartado, ver Decisions).
- Cambios de API pública, props nuevas o cambios en README/docs/panel de controles.
- Tocar el mecanismo de reduced motion (el realce estático no se ve afectado).

## Decisions

### D1: Máscara de anillo con `mask-clip` + `mask-composite: intersect` (elegida)

Sobre `.aui-border-beam-layer`:

```css
mask-image: linear-gradient(#000, #000), linear-gradient(#000, #000);
mask-clip: padding-box, border-box;
mask-composite: intersect;
padding: var(--aui-beam-border-width, 2px);
mask-mode: alpha; /* según necesidad de la composición exclude/intersect */
```

La capa solo pinta la banda entre `border-box` y `padding-box` (el "anillo" del borde, de espesor `borderWidth`, que sigue el `border-radius` heredado). Del cometa rígido solo se ve la intersección con ese anillo curvo: la cola deja de sobresalir y perceptualmente el beam dobla la esquina. Es la solución canónica del efecto (misma técnica que las implementaciones de referencia tipo Magic UI).

Nota de implementación: para que exista banda entre las dos cajas, la capa necesita un `padding` igual a `--aui-beam-border-width` (hoy no tiene). La composición exacta (`intersect` con clips distintos, o `exclude` según cómo se formulen los dos gradientes) se valida visualmente en test-app; el criterio de aceptación es "solo se pinta el anillo".

**Alternativas consideradas:**

- **`overflow: hidden` a secas** — evita que se salga, pero la cola cruza la esquina por dentro, flotando separada del borde. Peor resultado visual por el mismo costo.
- **Motor SVG stroke-dash (Wave L)** — doblado geométrico perfecto y velocidad constante, pero exige `useResizeObserver` + prop `radius` explícita (rompe el contrato "heredá el border-radius y listo"), y el degradé de la estela a lo largo del path no es nativo en SVG. Costo alto para un fix.
- **Conic-gradient rotando (motor GlowBorder)** — dobla perfecto pero con velocidad angular constante ≠ lineal (en cards anchas el cometa acelera y cambia de largo); convertiría BorderBeam en un casi-duplicado de GlowBorder.

### D2: El gate `@supports` pasa a exigir también soporte de máscara compuesta

Hoy: `@supports not (offset-path: border-box) { display: none }`. Se amplía para ocultar el cometa también cuando falta soporte del enmascarado (`mask-composite: intersect` o su detección equivalente): mostrar el cometa sin máscara reintroduce el bug. La forma concreta (un solo bloque con `and`, o dos bloques `@supports not`) queda a criterio de implementación; el comportamiento requerido es: cometa visible ⇔ browser soporta ambas features. Contenedor y children nunca se ven afectados.

### D3: Corrección de comentario y docstring, sin cambios de tipos

El comentario del CSS y el docstring del componente afirman que el cometa "sigue el perímetro incluyendo `border-radius`" — cierto solo para la cabeza. Se reescriben describiendo el mecanismo real: cabeza sobre el path + capa enmascarada al anillo que recorta la estela a la curva. `types.ts` no cambia (JSDoc de props intactos, sin superficie nueva).

### D4: La copia standalone se actualiza en el mismo change

`examples/border-beam.tsx` reimplementa el mismo CSS; recibe la misma máscara, gate y comentario corregido. Criterio dual de consumo del roadmap.

## Risks / Trade-offs

- **[El cometa se acorta un instante en las esquinas]** — con `size` mucho mayor que el radius, gran parte de la píldora cae fuera del anillo al doblar y el segmento visible se encoge momentáneamente. → Aceptado: es el compromiso de todas las versiones CSS-puras del efecto; la alternativa exacta (SVG) tiene costos descartados en D1. Verificación visual en test-app con radius chico y `size` grande para confirmar que lee bien.
- **[Soporte de `mask-composite`]** — Chrome 120+, Safari 15.4+, Firefox estable; en browsers viejos el cometa desaparece donde antes se veía (mal). → Mitigado por D2: la degradación es al estado "sin cometa", ya especificado y aceptado por la spec del componente.
- **[Interacción máscara ↔ realce estático de reduced motion]** — el realce usa `box-shadow: inset` sobre la misma capa; con la máscara de anillo el shadow queda igualmente confinado al anillo (visualmente equivalente o mejor). → Verificar en test-app con reduced motion activo; si la máscara lo degradara, limitar la máscara al estado animado.
- **[Doble mantenimiento del CSS]** — componente y ejemplo standalone duplican el bloque; riesgo de divergencia. → Ya es la convención del repo (criterio dual); la task list exige tocar ambos.
