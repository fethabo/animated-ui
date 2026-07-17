## Why

La cola del cometa de `BorderBeam` se sale de la card en cada esquina redondeada: el cometa es un nodo rígido sobre `offset-path` (que traslada y rota el elemento, pero nunca lo deforma), así que al doblar una esquina la estela queda extendida en línea recta sobre la tangente del arco — por fuera de la curva — y la capa no tiene ninguna máscara que recorte lo que sobresale. El resultado contradice la spec vigente de `border-beam`, que exige que el cometa recorra el perímetro "siguiendo el `border-radius`".

## What Changes

- Enmascarar `.aui-border-beam-layer` al anillo del borde (banda entre `border-box` y `padding-box`) con `mask-clip: padding-box, border-box` + `mask-composite: intersect`, de modo que del cometa solo se vea la intersección con el anillo curvo. La cola deja de sobresalir y visualmente dobla las esquinas. Se mantiene cero JS por frame.
- Extender la degradación `@supports`: el cometa solo se muestra cuando el browser soporta tanto `offset-path: border-box` como el enmascarado compuesto; sin soporte de máscara, el cometa se oculta (mostrarlo sin máscara reintroduce el bug de la cola).
- Corregir el comentario interno y el docstring de `BorderBeam`, que hoy afirman que el cometa "sigue el perímetro incluyendo border-radius" — solo la cabeza lo hace; la explicación debe describir el mecanismo real (cabeza sobre el path + estela recortada al anillo).
- Aplicar la misma fix a la copia standalone `examples/border-beam.tsx` (criterio de consumo dual).
- Verificación visual en `test-app` con `border-radius` grande y `size` largo (el caso que evidencia el bug). Sin cambios de props ni de API pública: no cambian README, panel de controles ni `props.es.json`.

## Capabilities

### New Capabilities

<!-- Ninguna. -->

### Modified Capabilities

- `border-beam`: el requirement del recorrido pasa a exigir que el cometa quede visualmente confinado al anillo del borde (nunca se dibuja fuera del contenedor ni cruza las esquinas en línea recta), y la degradación `@supports` pasa a cubrir también la falta de soporte de enmascarado compuesto (`mask-composite`), ocultando el cometa en ese caso.

## Impact

- `src/components/BorderBeam/index.tsx`: bloque CSS inyectado (máscara de anillo + gate `@supports` ampliado) y comentario/docstring.
- `examples/border-beam.tsx`: misma fix en la versión autocontenida.
- `openspec/specs/border-beam/spec.md`: delta de requirements (via este change).
- Sin cambios en tipos públicos, README, docs web ni test-app harness (no cambia la superficie de props). `test-app` se usa solo para verificación visual.
- Riesgo de compatibilidad: `mask-composite: intersect` requiere browsers modernos (Chrome 120+, Safari 15.4+, Firefox estable); en browsers más viejos el cometa se oculta con la degradación ya establecida como patrón del componente.
