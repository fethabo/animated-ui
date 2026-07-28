# fix-docs-demo-frame

## Why

El frame en que la docs monta cada demo (`.docs-demo`) y el modo full-bleed no son neutrales: alteran el render de componentes que el test-app muestra bien. Las dos apps consumen el mismo `dist/` (symlink `file:..` y prebundles de Vite idénticos), así que estas diferencias son del host, no del paquete.

**Full-bleed tapa el sidebar.** `.docs-demo--bleed` compensa el offset del sidebar para expandirse a `100vw`:

```
width: 100vw;
margin-left: calc(50% - 50vw - var(--docs-bleed-shift, 120px));   /* 120px = medio sidebar */
```

Con viewport 1440 y sidebar 240 el demo arranca en x=0, es decir encima del sidebar. Y gana la pelea de pintado: `.aui-hscroll-inner` es `position: sticky` (crea stacking context con `z-index: auto`) igual que `.docs-sidebar`, y viene después en el DOM. El header sobrevive porque tiene `z-index: 100`; el sidebar no tiene ninguno. Resultado: mientras dura la sección, el sidebar queda inutilizable.

**El frame deforma componentes con transform 3D.** En el demo de TiltCard, la card muestra artefactos de borde del lado que rota hacia el viewer — el opuesto al puntero. El test-app no los muestra. El frame difiere en cuatro cosas, y la sospecha principal es el clip redondeado:

| | test-app | docs |
|---|---|---|
| recorte | `overflow: hidden`, sin radio | `overflow: hidden` + `border-radius: 10px` |
| altura | `50vh` (~400 px) | `min-height: 320px` |
| fondo de la card | color plano | `linear-gradient(135deg, …)` |
| box model | `content-box` (sin reset) | `border-box` (`* {}` en `base.css`) |

Un clip rectangular se resuelve con un clip rect barato; uno con esquinas redondeadas sobre un descendiente compositado en 3D (el inner de TiltCard tiene `will-change: transform` + `preserve-3d`) obliga a rasterizar una máscara, y el lado magnificado por la rotación se dibuja sobre un raster hecho a 1×. Es una hipótesis, no una causa confirmada: este change arranca por aislarla antes de tocar nada.

## What Changes

- **El full-bleed se limita al área de contenido**: `.docs-demo--bleed` pasa de `100vw` al ancho disponible a la derecha del sidebar, expuesto como CSS var para que los paneles del demo midan contra ella en vez de hardcodear `100vw`. Nada queda tapado, no hay solapamiento con el chrome del sitio y el sidebar sigue usable durante toda la sección. En mobile (`max-width: 800px`) el sidebar no es lateral y la var colapsa a `100vw`.
- **Diagnóstico dirigido del artefacto de TiltCard** antes de la corrección, aislando una variable por vez sobre el frame (radio del clip / recorte / capa compositada). La corrección concreta depende del resultado; el requisito se expresa por resultado observable, no por mecanismo.
- **Paridad de frame verificada como criterio**: el frame del demo es chrome de la docs y no debe participar del render del componente. Se agrega el invariante y sus escenarios a la capability, de modo que el próximo componente con transform 3D o recorte propio tenga contra qué contrastarse.

## Capabilities

### Modified Capabilities

- `docs-site`: un demo full-bleed SHALL ocupar el área de contenido sin superponerse al chrome del sitio (sidebar, header) ni ocultarlo; y el frame del demo NO SHALL alterar el render del componente que contiene — en particular NO SHALL introducir artefactos de borde en componentes con transform 3D, ni recortar geometría que el test-app muestra completa.

## Impact

- **Código**: `docs/src/pages/component-page.css` (`.docs-demo--bleed`, y `.docs-demo` según lo que arroje el diagnóstico), `docs/src/demos/horizontal-scroll-section.tsx` (paneles que dejan de hardcodear `100vw`). Posiblemente `docs/src/layout/layout.css` si el diagnóstico apunta al stacking.
- **Demos afectados**: `horizontal-scroll-section` (único `full-bleed`) directamente; `text-scroll-reveal`, `stacked-cards` y `sticky-scenes` (`flow`) comparten el camino de `.docs-demo--flow` y entran en la verificación de no-regresión. El cambio de `.docs-demo` alcanza a los 50 demos, por eso la verificación visual es parte del scope.
- **Sin cambios en la librería**: `HorizontalScrollSection` y `TiltCard` no se tocan. Si el diagnóstico mostrara que el artefacto es del componente y no del frame, este change se detiene y abre uno sobre la capability del componente.
- **Riesgo**: medio-bajo, concentrado en el ancho del full-bleed — el `100vw` actual está calibrado para no generar scroll horizontal, y la nueva fórmula tiene que preservar esa propiedad en todos los breakpoints, con y sin scrollbar visible.
- **Dependencias**: ninguna con `fix-docs-control-defaults`; tocan archivos distintos y pueden implementarse en cualquier orden.
