## Why

El panel de controles interactivo de la web de documentación (introducido por el change ya archivado `docs-demo-controls`) tiene tres defectos que degradan la experiencia y, en un caso, muestran datos incorrectos:

1. **Fuga de estado entre componentes.** Al navegar entre vistas, el panel conserva el estado del componente anterior: muestra `undefined` para props que el componente actual no comparte y hereda valores ajenos para props de nombre coincidente (`color`, `zIndex`, etc.). Esos valores además se derraman al demo. Es un bug visible y desorienta al usuario.
2. **Panel recortado.** En demos de poca altura el panel abierto se decapita por el `overflow:hidden` del frame, dejando controles inaccesibles.
3. **Demos mal andamiados.** Ocho demos renderizan de forma incorrecta respecto de su gemelo del test-app (sin padding, sin recorrido de scroll, desbordando el ancho, dibujando fuera de lugar, o sin el efecto funcional).

Además, el usuario no tiene forma de llevarse la configuración que armó con los controles: falta un "builder" que muestre y permita copiar las props seleccionadas, y un botón para volver a los defaults.

## What Changes

- **Reset de estado por componente.** El estado del panel SHALL reinicializarse a los defaults al cambiar de componente, eliminando la fuga de valores/`undefined` entre vistas.
- **Botón "Reset".** El panel SHALL ofrecer un control que devuelva todas las props a sus valores por default.
- **Panel fuera del frame recortado.** Los controles SHALL vivir en una región propia (no como overlay dentro del frame `overflow:hidden`), garantizando que todos los controles sean siempre accesibles independientemente de la altura del demo.
- **Builder copiable (nuevo).** La región de controles SHALL mostrar un snippet de código generado en vivo con las props seleccionadas —**solo las que difieren de su default**— y un botón para copiarlo al portapapeles. `respectReducedMotion` NO aparece salvo que se lo modifique. Este snippet es adicional y NO reemplaza los dos tabs de ejemplo existentes.
- **Modo full-bleed para demos scroll-driven (nuevo).** Un demo SHALL poder declararse "full-bleed" para romper el ancho del artículo y scrollear contra la ventana, replicando el `bare` del test-app. Necesario para `StickyScenes` y `HorizontalScrollSection`.
- **Corrección de scaffolding en 8 demos:** `AnimatedList` y `AutoHeight` (padding/centrado), `TextScrollReveal` (recorrido de scroll con espaciadores), `StickyScenes` y `HorizontalScrollSection` (full-bleed), `ScribbleDecoration` (caja dimensionada), `ImageDissolve` (fuente PNG por canvas con números, en vez de SVG que taintea el canvas), `Marquee` (layout/medición).

Sin cambios que rompan la API pública del paquete `@fethabo/animated-ui`; todo el alcance vive en `docs/`.

## Capabilities

### New Capabilities
<!-- Ninguna: todo el comportamiento nuevo (builder, reset, full-bleed) es parte de la web de documentación, cubierta por la capability existente docs-site. -->

### Modified Capabilities
- `docs-site`: El requirement del panel de controles se amplía para (a) exigir el reset de estado por componente, (b) un botón Reset, (c) ubicar el panel fuera del frame recortado, y (d) exponer un snippet builder copiable con solo las props modificadas. El requirement "el demo refleja el uso correcto del componente" se refuerza incorporando el modo full-bleed para demos scroll-driven y la corrección de los 8 demos mal andamiados.

## Impact

- **Código afectado (solo `docs/`):**
  - `docs/src/components/ControlPanel.tsx` — reset por componente, botón Reset, snippet builder, extracción del panel fuera del frame.
  - `docs/src/pages/ComponentPage.tsx` — `key` por slug en el panel; wiring del modo full-bleed.
  - `docs/src/components/control-panel.css`, `docs/src/pages/component-page.css` — layout del panel fuera del frame, estilos del snippet/botones, modo full-bleed.
  - `docs/src/content.ts` — soporte del descriptor de layout full-bleed en `DemoModule`.
  - Demos: `animated-list.tsx`, `auto-height.tsx`, `text-scroll-reveal.tsx`, `sticky-scenes.tsx`, `horizontal-scroll-section.tsx`, `scribble-decoration.tsx`, `image-dissolve.tsx`, `marquee.tsx`.
  - `docs/src/i18n/dict.ts` — labels nuevos (Reset, Copiar, etc.).
- **Sin impacto** en el paquete publicado, su API, ni en el test-app.
- **Referencia de paridad:** `test-app/src/demos/*.jsx` es la fuente de verdad de cómo debe verse cada demo.
