# fix-docs-demo-frame — Design

## Geometría actual del full-bleed

`.docs-demo--bleed` no tapa el sidebar por accidente: la fórmula lo busca. Con viewport 1440 y sidebar 240:

```
          0        240                                            1440
          ├─────────┼───────────────────────────────────────────────┤
sidebar   [ 240px  ]
content             [········ padding clamp(16,4vw,48) ········]
article                    [380 ──────── max-width 920 ──────── 1300]
                            │
                            └─ margin-left = 50%(460) − 50vw(720) − 120 = −380
demo      [0 ─────────────────── width: 100vw = 1440 ───────────────]
          ↑
          arranca en el borde del viewport, encima del sidebar
```

El `−120px` es exactamente medio sidebar, y existe para que el `100vw` no genere scroll horizontal: sin él, el artículo centrado en `[240 .. 1440]` empujaría el bleed 120 px a la derecha del viewport.

## Decisión: el bleed llega hasta el borde del sidebar

El ancho objetivo pasa a ser el área de contenido completa:

```
.docs-demo--bleed {
  --docs-content-w: calc(100vw - var(--docs-sidebar-w));
  width: var(--docs-content-w);
  max-width: var(--docs-content-w);
  margin-left: calc(50% - var(--docs-content-w) / 2);
}

@media (max-width: 800px) {
  .docs-demo--bleed { --docs-sidebar-w: 0px; }   /* el sidebar deja de ser lateral */
}
```

`--docs-sidebar-w` sale de `layout.css` como fuente única (hoy el `240px` del sidebar y el `120px` del shift son dos constantes que tienen que sumar bien y nadie las ata). El `margin-left` recentra el bloque respecto del artículo, igual que hoy, pero contra el nuevo ancho.

Se descartaron:

- **`.docs-sidebar { z-index: 50 }`** (una línea): el demo sigue a `100vw` y los 240 px izquierdos quedan permanentemente bajo el sidebar. En un demo de paneles full-viewport que scrollean horizontalmente, eso significa no ver nunca el borde izquierdo de ningún panel.
- **Dejarlo como está**: el sidebar queda inutilizable durante la sección, y la sección mide varios viewports de scroll.

### Consecuencia en el demo

Los paneles de `horizontal-scroll-section.tsx` hardcodean `width: '100vw'`. Deben pasar a la var, con `100vw` como fallback para que el demo siga siendo copiable fuera de la docs:

```
width: 'var(--docs-content-w, 100vw)'
```

`HorizontalScrollSection` mide el recorrido desde el ancho real de la fila (`.aui-hscroll-row` es `width: max-content`), así que el cálculo de `--aui-hscroll-travel` se adapta solo. No hace falta tocar el componente.

### Qué verificar en el ancho

La propiedad que hay que preservar es "sin scroll horizontal en el documento". Los casos que la rompen si la fórmula queda mal:

- con y sin scrollbar clásica visible (`100vw` incluye la scrollbar, `100%` no)
- en el breakpoint `800px` justo, donde el sidebar cambia de lateral a apilado
- con el artículo más angosto que su `max-width` (viewport chico pero > 800)

## El artefacto de TiltCard: diagnóstico antes que corrección

No hay causa confirmada. Lo que sí está descartado por lectura:

- **No es el `perspective-origin`.** El root de TiltCard shrink-wrappea a la card en **las dos** apps: `.docs-demo-stage` es `flex-direction: column` con `align-items: center`, y la `Section` del test-app también. El punto de fuga cae en el centro de la card en ambos casos.
- **No son `maxAngle` ni `perspective`.** 14 vs 12 grados y 1000 vs 1000 no producen un artefacto de borde.

Quedan cuatro diferencias, en orden de sospecha. El aislamiento es una variable por vez, en DevTools, sin tocar código:

| # | qué tocar en DevTools | si el artefacto desaparece acá |
|---|---|---|
| 1 | `.docs-demo { border-radius: 0 }` | es el clip redondeado → rasteriza una máscara sobre la capa 3D |
| 2 | `.docs-demo { overflow: visible }` | es recorte geométrico → falta altura, no es rasterización |
| 3 | inner de TiltCard: `will-change: auto` | es la capa compositada → el raster a 1× se magnifica con la rotación |
| 4 | card: fondo plano en vez de `linear-gradient` | es el gradiente sobre superficie transformada |

La corrección depende del resultado, y cada rama tiene una salida distinta:

- **(1)** → mover el `border-radius` a un wrapper que no recorte, o quitarlo del frame que contiene demos con transform 3D.
  **Resultado: El artefacto desapareció al quitar el `border-radius`.** Al quitar el borde redondeado del contenedor con `overflow: hidden`, el navegador deja de rasterizar una máscara sobre la capa 3D (el inner transformado de TiltCard). Esto confirma que el clipping redondeado es el causante del problema.
- **(2)** → subir el `min-height` del frame para que la card tenga aire al rotar. Hoy `.docs-demo` da 320 px y la card mide ~139 px, así que hay ~90 px de holgura por lado: es la rama menos probable, pero es la más barata de confirmar.
- **(3)** → el `will-change` vive en la librería (`TiltCard/index.tsx:100`). Si el artefacto es de ahí, **este change se detiene**: pasa a ser un cambio de componente, con su propio proposal sobre la capability `tilt-card`.
- **(4)** → es cosmética del demo: fondo plano y listo.

Si ninguna de las cuatro lo elimina, el diagnóstico sigue con captura del render (screenshot con y sin frame) antes de proponer nada. **No se escribe corrección sin causa identificada**: un cambio a ciegas sobre `.docs-demo` alcanza a los 50 demos.

## Por qué el invariante se escribe por resultado

La spec no puede fijar "el frame no usa border-radius": eso ata la docs a un mecanismo y no dice nada sobre el próximo componente que rompa. El invariante útil es que el frame es chrome y no participa del render — verificable contra el test-app, que es la referencia que la capability ya usa para paridad de demos.
