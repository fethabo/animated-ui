# fix-docs-control-defaults

## Why

El panel de controles de la docs inicializa su estado con el `default` de cada control y **pasa todas las props al demo siempre**, aunque el usuario no toque nada. Eso convierte a `docs/src/demos/*.tsx` en una segunda copia, escrita a mano y sin validar, de los defaults de la API: el default declarado en el control gana por sobre el de la librería, y el componente nunca corre con su configuración real.

Hoy hay 261 controles declarados en 50 demos. Un diff contra `src/generated/props.json` (que ya se genera en cada `prebuild` desde el source con react-docgen-typescript) muestra 86 defaults que no coinciden con el de la librería. La mayoría son elecciones deliberadas de la docs, pero dos son errores de **unidad** que rompen el demo por completo:

| demo | prop | control | librería | unidad real | factor |
|---|---|---|---|---|---|
| `click-spark` | `duration` | `500` (min 200) | `0.4` | segundos | 1250× |
| `cursor-trail` | `life` | `500` (min 100) | `0.6` | segundos | 833× |

`ClickSpark` convierte `duration` a frames (`duration * 60`): con `500` las chispas viven 30.000 frames (~7 minutos) en vez de 24. `CursorTrail` resta `dt` en segundos a `life`: con `500` la estela tarda ~8 minutos en desvanecerse y el RAF queda corriendo todo ese tiempo. Ese es exactamente el síntoma reportado —"los efectos dibujados no desaparecen"— y no se reproduce en el test-app porque su harness declara los mismos controles en segundos (`0.4` y `0.6`).

Los `min` confirman que el rango nunca se ejercitó: aun arrastrando el slider al mínimo no se puede alcanzar un valor correcto. Corregir los dos valores es trivial; lo que importa es cerrar la fábrica de bugs, porque cada cambio de default en la librería vuelve a divergir en silencio.

## What Changes

- **Corrección de los dos errores de unidad**: `click-spark.duration` y `cursor-trail.life` pasan a segundos, con `min`/`max`/`step` coherentes con la escala real de la prop.
- **Guard en el build de contenido** (`docs/scripts/build-content.mjs`, donde ya vive el chequeo de *cobertura* de controles): la validación se extiende de "existe un control por prop" a "el control es fiel a la API". Dos invariantes por control, contra `props.json`:
  - el `default` del control SHALL coincidir con el `defaultValue` de la librería;
  - para controles `number`, el `defaultValue` de la librería SHALL caer dentro de `[min, max]` — el invariante que habría atrapado `min: 200` sobre una prop cuyo default es `0.4`.
- **Escape hatch declarado**: `DemoControl` gana un campo opcional `override: string` con el motivo de la divergencia. Un control con `override` queda exento de la primera invariante (no de la segunda). Se aplica a los 25 pares `(demo, prop)` que divergen a propósito y cuyo valor no está también en el JSX del demo (`tilt-card.glare`, `marquee.fadeEdges`, `particle-field.links`, `typewriter-text.loop`, …).
- **Cobertura del guard**: 25 de los 261 controles no son verificables hoy porque `props.json` reporta `defaultValue: null` (defaults que viven en un objeto `DEFAULTS` o en expresiones que react-docgen-typescript no resuelve, sobre todo paletas `colors[]`). El guard SHALL reportarlos explícitamente como no verificables en vez de dejarlos pasar en silencio.

## Capabilities

### Modified Capabilities

- `docs-site`: el panel de controles SHALL aplicar el `default` de cada control como prop del demo desde el mount (comportamiento actual, hasta hoy implícito), y por lo tanto los defaults y rangos declarados SHALL ser fieles a la API de la librería, verificado en build contra `props.json`, con divergencias deliberadas declaradas explícitamente.

## Impact

- **Código**: `docs/scripts/build-content.mjs` (extensión del chequeo existente), `docs/src/content.ts` (campo `override` en `DemoControl`), y los demos afectados: 2 correcciones de unidad + 25 anotaciones `override`.
- **Build**: el `prebuild` de la docs falla ante un control infiel sin declarar. No cambia el bundle ni el runtime del sitio.
- **Comportamiento visible**: solo cambian los demos de ClickSpark y CursorTrail, que pasan a mostrar el efecto real (ráfaga y estela que se desvanecen). El resto queda idéntico: las divergencias deliberadas se conservan tal cual, solo se anotan.
- **Riesgo**: bajo. El único riesgo es un falso positivo del guard sobre un default que la librería expresa de forma que `props.json` normaliza distinto (arrays, strings citadas); se mitiga normalizando comillas y comparando arrays por elemento antes de comparar.
- **No incluido (follow-up)**: la librería mezcla unidades entre componentes — `ClickSpark.duration` y `CursorTrail.life` en segundos, `ImageTrail.duration`, `ImageDissolve.duration`, `CountUp.duration`, `AttentionCue.duration` y `GuidingBranches.duration` en milisegundos. Esa inconsistencia es la trampa de fondo que hizo posible el error, pero unificarla es un cambio de API pública y va en su propio change.
