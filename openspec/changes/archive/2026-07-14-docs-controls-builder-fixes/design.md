## Context

La web de docs (`docs/`, Vite + React Router) renderiza una vista por componente (`ComponentPage.tsx`). Los demos declaran opcionalmente `export const controls: DemoControl[]` y un `demoLayout: 'frame' | 'flow'`. `ControlPanel.tsx` toma ese descriptor, mantiene el estado de las props con `useState` y las bindea al demo vía render prop `(state) => <Demo {...state} />`.

Estado actual y restricciones:

- `ControlPanel` inicializa su estado con `useState(() => initialState(normalized))`. El inicializador solo corre una vez por instancia de React.
- `ComponentPage` renderiza `<ControlPanel controls={controls} .../>` en una posición estable del árbol, sin `key`. React reconcilia la misma instancia entre rutas → el estado nunca se reinicializa.
- El panel es un overlay `position:absolute` dentro de `.docs-demo` (`overflow:hidden; min-height:320px`).
- El test-app (`test-app/src/demos/*.jsx` + `test-app/src/harness/ControlPanel.jsx`) es la referencia de paridad visual. Su harness da a cada demo una `height` o `bare:true`, y remonta por demo (por eso no sufre la fuga de estado).
- El spec `docs-site` ya tiene el requirement "El panel NO SHALL modificar el código de ejemplo" (los dos tabs Uso/Standalone). El builder nuevo debe respetarlo: es un snippet **separado**.

Este change no toca el paquete publicado; todo vive en `docs/`.

## Goals / Non-Goals

**Goals:**
- Eliminar la fuga de estado del panel entre componentes (root cause del `undefined` y de heredar valores ajenos).
- Hacer que todos los controles sean siempre accesibles sin importar la altura del demo.
- Ofrecer un botón Reset y un snippet builder copiable (solo props modificadas).
- Corregir el andamiaje de los 8 demos rotos, con paridad visual respecto del test-app.
- Introducir un modo full-bleed para demos scroll-driven.

**Non-Goals:**
- Modificar la API pública del paquete o cualquier componente de la librería.
- Tocar el test-app.
- Reescribir el sistema de tabs de ejemplos (Uso/Standalone) — permanecen estables.
- Soporte multi-tema o cambios de estética del sitio.
- Persistir la configuración del builder en URL/localStorage (posible follow-up, fuera de alcance).

## Decisions

### D1 — Reset de estado por `key`, no por `useEffect`

Reinicializar el estado del panel al cambiar de componente usando `key={entry.slug}` en `<ControlPanel>` dentro de `ComponentPage`. React desmonta y remonta la instancia, corriendo de nuevo `useState(() => initialState(...))`.

- **Alternativa considerada:** un `useEffect([controls])` que llame `setState(initialState(...))`. Rechazada: introduce un render intermedio con estado viejo (parpadeo/props ajenas derramadas por un frame) y es más frágil que remontar. `key` es la solución idiomática de React para "resetear estado por identidad".
- El botón **Reset** reutiliza exactamente `setState(initialState(normalized))` — misma operación, disparada por el usuario en vez de por navegación.

### D2 — Panel en región propia, fuera del frame

Sacar el panel del interior de `.docs-demo` (que recorta) y renderizarlo como una región hermana debajo del frame del demo, dentro de `ComponentPage`. El frame conserva `overflow:hidden` (los backgrounds lo necesitan); el panel ya no depende de la altura del frame.

- **Alternativa considerada:** mantener el overlay pero portalizarlo / usar `position:fixed`. Rechazada: colisiona con el contenido, tapa el demo, y no da lugar natural al snippet builder. Una región dedicada resuelve recorte + builder de una sola vez.
- **Alternativa considerada:** panel lateral (columna). Rechazada para v1: el artículo es de ancho acotado (`max-width:920px`) y una columna lateral aprieta el demo. Debajo es más simple y responsive.
- Los demos flow/full-bleed (que scrollean contra la ventana) conservan un panel anclado al viewport (`position:fixed`), porque no hay un "debajo del frame" estático útil mientras se scrollea.

### D3 — Snippet builder: solo props modificadas

Generar el snippet comparando `state[prop]` contra `control.default` de cada control declarado; emitir únicamente los que difieren. Formato JSX: strings `prop="valor"`, números/booleans/arrays `prop={valor}`. `respectReducedMotion` sigue la misma regla (solo si se cambió). El nombre del componente para el snippet se toma del registry/slug.

- **Rationale:** produce código limpio y pegable; coincide con la decisión del usuario. Mostrar todos los props ensucia con defaults redundantes.
- **Copia:** botón que escribe el snippet en el portapapeles reutilizando el patrón de copia ya existente en `CodeBlock`/tabs (confirmación visual).
- **Contrato con `docs-site`:** este snippet es una salida **separada** del panel; los dos tabs de ejemplo (Uso/Standalone) permanecen intactos, respetando el requirement vigente.

### D4 — Modo full-bleed declarativo

Extender el descriptor de layout del demo para admitir un modo full-bleed (además de `frame`/`flow`), que permita al demo romper el ancho del artículo y ocupar el viewport, scrolleando contra la ventana. `ComponentPage` aplica la clase correspondiente y el panel pasa a modo anclado.

- **Rationale:** `StickyScenes` (sticky contra ventana) y `HorizontalScrollSection` (paneles `100vw`) son inherentemente full-viewport; forzarlos dentro del artículo de 920px es la causa del apilamiento y el desborde horizontal. El test-app los trata como `bare`.
- **Alternativa considerada:** frame con scroll interno propio. Rechazada: menos fiel al uso real y frágil (sticky/scroll-driven se rompen dentro de contenedores con `overflow`).

### D5 — Correcciones por demo (paridad con test-app)

- **AnimatedList / AutoHeight:** envolver en `.docs-demo-stage` (o equivalente) para recuperar padding y centrado.
- **TextScrollReveal:** layout con recorrido de scroll (espaciadores antes/después) para que el efecto tenga travel, replicando los spacers de 70vh del test-app.
- **StickyScenes / HorizontalScrollSection:** adoptar el modo full-bleed de D4.
- **ScribbleDecoration:** renderizar sobre una caja con dimensiones explícitas (patrón 200×120 del test-app) en vez de overlay absoluto sobre texto inline sin medida.
- **ImageDissolve:** generar las imágenes como PNG por canvas con los números 1/2/3 dibujados (como el test-app), en vez de SVG data-URI que taintea el canvas e impide `getImageData`. Bug funcional, no solo cosmético.
- **Marquee:** alinear el layout con el del test-app (`position:absolute; inset:0` centrado) para evitar la medición del track sobre ancho 0 en el primer paint. **Requiere verificación en runtime** para confirmar la causa de los mensajes de consola / jank.

## Risks / Trade-offs

- **Fuente de "props modificadas" depende de defaults correctos** → Si un `control.default` no coincide con el default real del componente, el snippet puede omitir/incluir props engañosamente. Mitigación: los defaults de los controles ya buscan reflejar el componente; revisar caso por caso al tocar cada demo.
- **Full-bleed rompe el flujo del artículo** → Puede introducir scroll horizontal o layout raro si se aplica mal. Mitigación: acotar a los 2 demos que lo necesitan y verificar en runtime que no haya overflow del `body`.
- **Marquee: causa no confirmada** → El fix es una hipótesis (medición sobre ancho 0). Mitigación: verificar en runtime; si la causa es otra (p. ej. warning propio de la librería), documentarlo y acotar el arreglo al demo sin tocar el paquete.
- **Snippet builder podría divergir del código de ejemplo** → Riesgo de confundir al usuario con dos fuentes de código. Mitigación: rotular claramente el snippet como "configuración actual" y mantenerlo visualmente separado de los tabs de ejemplo.

## Migration Plan

Cambio interno de la app de docs, sin migración de datos ni API. Se despliega con el build normal del sitio. Rollback = revertir el change; no hay estado persistido. Verificación de paridad demo por demo contra el test-app antes de dar por cerrado (skill de verificación en runtime).

## Open Questions

- **Marquee:** ¿la causa real es la medición sobre ancho 0, o un warning emitido por el propio componente? A confirmar en runtime durante la implementación.
- **Nombre del componente en el snippet:** ¿se deriva del slug/registry o se declara explícito por demo? Preferencia: derivar del registry; declarar override por demo solo si algún caso no mapea limpio.
