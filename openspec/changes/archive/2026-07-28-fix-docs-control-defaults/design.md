# fix-docs-control-defaults — Design

## Contexto: por qué el default del control es load-bearing

`ControlPanel` mantiene un único estado y lo spreadea completo en el demo:

```
initialState(controls) = { [c.prop]: c.default }   // docs/src/components/ControlPanel.tsx:20
<Demo {...state} />                                 // via render prop, línea 234
```

No hay noción de "prop tocada". Desde el primer frame el demo recibe **todas** las props con el valor declarado en `controls`, así que el default de la librería nunca se ejecuta en la docs. El JSX del demo tampoco protege: `{...props}` va después de los literales, así que el control gana.

```
src/components/X/index.tsx   duration = 0.4          ← fuente de verdad
        │
        ├─→ docs/src/generated/props.json  "0.4"     ← derivada, correcta, se
        │        (react-docgen-typescript, prebuild)    regenera en cada build
        │
        └─→ docs/src/demos/x.tsx  { default: 500 }   ← copia manual, sin atadura
                 │
                 ▼  ControlPanel siempre pasa state[prop]
            <X duration={500} />
```

El mismo mecanismo existe en `test-app/src/harness/ControlPanel.jsx`; la diferencia es que ahí los valores están bien. No es que el test-app sea más robusto: tuvo suerte.

## Decisión: guard en build, no inversión de capas

Se evaluó invertir la capa —que `ControlPanel` aplique solo las props tocadas y deje fluir el default de la librería— y se descartó por dos costos concretos:

1. **Migración**: 25 pares `(demo, prop)` divergen a propósito y no están en el JSX del demo. Habría que moverlos, uno por uno, sin red.
2. **Fidelidad del snippet**: el snippet builder incluye solo las props que difieren de su default (`docs-site` lo exige). Si el baseline pasa a ser el default de la librería pero el demo renderiza con valores del JSX, el snippet queda desincronizado de lo que se ve: `<TiltCard />` con el glare visiblemente encendido.

El guard no tiene ninguno de los dos: no cambia el flujo de datos, no toca el snippet builder, y ataca la causa real —que la copia manual no está atada a la fuente— en el único punto donde se puede verificar barato.

## Las dos invariantes

Por cada control de cada demo, contra `props.json[slug]`:

**I1 — Default fiel.** `norm(control.default) === norm(prop.defaultValue)`, salvo que el control declare `override`.

**I2 — Rango alcanzable.** Para `type: 'number'`: `min <= Number(prop.defaultValue) <= max`. **No exenta por `override`**: un override justifica arrancar en otro punto, nunca hacer inalcanzable el default de la librería.

I2 es la que hace el trabajo pesado contra errores de unidad. Un factor de 1000× siempre saca al default de la librería del rango del slider, y a diferencia de I1 no tiene falsos positivos por elección estética: no hay razón legítima para que un demo impida llegar al comportamiento por defecto del componente.

```
click-spark.duration:  min=200  max=1200   lib=0.4
                       └───────────────┘    ×      → I2 falla
                       0.4 ∉ [200, 1200]

tilt-card.maxAngle:    min=0    max=30     lib=15
                       └──────────────┘    ✓      → I2 pasa
                                                     (I1 falla: 14 ≠ 15 → necesita override)
```

## Normalización

`props.json` guarda el default como el texto del source, así que la comparación necesita normalizar antes de decidir:

| forma en props.json | forma en el control | tratamiento |
|---|---|---|
| `"'aurora'"` | `'aurora'` | quitar comillas envolventes |
| `"['rect', 'circle']"` | `['rect','circle']` | parsear como lista de strings y comparar por elemento |
| `"false"` / `"true"` | `false` / `true` | comparar como booleano |
| `"0.4"` | `0.4` | comparar como número (no como string) |

Sin esto, las 86 divergencias reportadas por el diff exploratorio incluyen ~60 falsos positivos que son puro artefacto de comillas. El guard SHALL normalizar primero y reportar solo divergencias reales.

## El agujero de cobertura

25 de los 261 controles tienen `defaultValue: null` en `props.json` y por lo tanto son inverificables:

```
animated-background.speed/intensity/colors   attention-cue.marker/showGuide
click-spark.colors    confetti-burst.colors  cursor-trail.mode/colors
draw-path.once        fireworks-burst.colors glitch-text.colors
glow-border.colors    guiding-branches.loop  particle-field.linkColor
ripple-container.maxRadius                   rotating-text.color
scribble-decoration.once                     scroll-reveal.once
sparkle-burst.colors  split-reveal.once      tesla-coil.cursorTrigger
text-highlighter.once text-scroll-reveal.fromColor/toColor
```

Dos causas: defaults que viven en un objeto `DEFAULTS` fuera del destructuring (react-docgen-typescript no los resuelve) y paletas `colors[]` cuyo default es una constante módulo.

Nótese que `click-spark.colors` y `cursor-trail.colors` están en la lista: **el guard no habría atrapado nada si el bug hubiera caído en la paleta en vez de en la duración**. Por eso el guard SHALL emitir la lista de inverificables como salida visible del build (warning, no error) en vez de contarlos como aprobados. Mejorar la extracción es un follow-up; hacerla visible es parte de este change.

## Alternativas descartadas

- **Test en vez de guard de build**: un test de vitest en `docs/` daría el mismo chequeo, pero el `prebuild` ya carga `props.json` y ya recorre los demos para validar cobertura. Meterlo ahí es incremental y falla en el mismo lugar donde el autor de un demo ya espera fallar.
- **Derivar `control.default` de `props.json` en runtime**: elimina la copia por construcción, pero rompe el snippet builder (necesita un baseline estable en el módulo del demo, no un valor resuelto async) y deja los rangos sin fuente.
- **Unificar unidades en la librería primero**: es la corrección de fondo y evita la clase entera de confusión, pero es un breaking change de API pública. Va en su propio change; este no depende de él.
