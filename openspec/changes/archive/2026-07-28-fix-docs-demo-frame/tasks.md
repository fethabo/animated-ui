# fix-docs-demo-frame — Tasks

## 1. Full-bleed limitado al área de contenido

- [x] 1.1 `docs/src/layout/layout.css`: extraer el ancho del sidebar a `--docs-sidebar-w` (fuente única; hoy el `240px` del sidebar y el `120px` de `--docs-bleed-shift` son dos constantes sin atadura)
- [x] 1.2 `docs/src/pages/component-page.css`: reescribir `.docs-demo--bleed` sobre `--docs-content-w: calc(100vw - var(--docs-sidebar-w))`, con `width`, `max-width` y `margin-left: calc(50% - var(--docs-content-w)/2)`; retirar `--docs-bleed-shift`
- [x] 1.3 Colapsar `--docs-sidebar-w` a `0px` en `@media (max-width: 800px)`, donde el sidebar deja de ser lateral
- [x] 1.4 `docs/src/demos/horizontal-scroll-section.tsx`: los paneles usan `width: 'var(--docs-content-w, 100vw)'` en vez de `100vw` hardcodeado (el fallback mantiene el demo copiable fuera de la docs)
- [x] 1.5 Verificar sin scroll horizontal del documento en: viewport ancho, viewport angosto > 800px, el breakpoint 800px exacto, y con scrollbar clásica visible
- [x] 1.6 Verificar que el sidebar queda visible, clickeable y scrolleable durante todo el recorrido de la sección, y que ningún panel queda parcialmente oculto

## 2. Diagnóstico del artefacto de TiltCard

- [x] 2.1 Reproducir y capturar el artefacto (puntero a un lado, borde opuesto), para tener referencia antes/después
- [x] 2.2 Aislar una variable por vez en DevTools, sin tocar código: `.docs-demo { border-radius: 0 }` → `.docs-demo { overflow: visible }` → inner de TiltCard `will-change: auto` → fondo plano en la card
- [x] 2.3 Registrar en `design.md` cuál de las cuatro lo elimina, con la captura
- [x] 2.4 Si la causa resulta ser el `will-change` de `TiltCard/index.tsx:100` (librería, no frame): **detener este change** y abrir uno sobre la capability `tilt-card`
- [x] 2.5 Si ninguna lo elimina: seguir el diagnóstico (render con y sin frame) antes de proponer corrección — no escribir cambios a ciegas sobre `.docs-demo`, que alcanza a los 50 demos

## 3. Corrección del frame (condicionada al resultado de 2)

- [x] 3.1 Aplicar la corrección de la rama identificada en 2.3
- [x] 3.2 Verificar que el artefacto desapareció y que el demo de TiltCard alcanza paridad visual con `test-app/src/demos/TiltCard.jsx`
- [x] 3.3 No-regresión visual del resto de los demos afectados por el cambio en `.docs-demo`: recorrer las 50 vistas, con atención a los `flow` (`text-scroll-reveal`, `stacked-cards`, `sticky-scenes`) y a los demos que dependen del recorte del frame

## 4. Cierre

- [x] 4.1 `npm run build` + `npm run preview` en `docs/`: verificar el full-bleed y el frame en build de producción, no solo en dev (descarta StrictMode/HMR como factor)
- [x] 4.2 `npx eslint` sobre los archivos modificados de `docs/`
