## 1. Fix 1 — Estado del panel + Reset

- [x] 1.1 En `docs/src/pages/ComponentPage.tsx`, agregar `key={entry.slug}` al `<ControlPanel>` para que remonte y reinicialice el estado por componente
- [x] 1.2 En `docs/src/components/ControlPanel.tsx`, agregar un botón "Reset" que ejecute `setState(initialState(normalized))`
- [x] 1.3 Agregar label i18n para "Reset" en `docs/src/i18n/dict.ts` (EN/ES)
- [ ] 1.4 Verificar en runtime: navegar A → B con props compartidas (`color`, `zIndex`) no arrastra valores ni muestra `undefined`; Reset vuelve a defaults

## 2. Fix 2 — Panel fuera del frame + builder copiable

- [x] 2.1 Extraer el panel de controles del interior de `.docs-demo` y renderizarlo como región hermana debajo del frame en `ComponentPage.tsx` (frame conserva `overflow:hidden`)
- [x] 2.2 Ajustar `docs/src/components/control-panel.css` y `docs/src/pages/component-page.css` para el layout de la región (no recortada); conservar panel anclado al viewport para demos flow/full-bleed
- [x] 2.3 Implementar el generador de snippet en `ControlPanel.tsx`: comparar `state[prop]` vs `control.default` y emitir solo props modificadas en formato JSX (strings entre comillas, resto entre llaves); `respectReducedMotion` solo si cambió
- [x] 2.4 Derivar el nombre del componente para el snippet desde el registry/slug
- [x] 2.5 Renderizar el snippet en la región de controles con un botón "Copiar" (reutilizar patrón de copia de `CodeBlock`, con confirmación visual)
- [x] 2.6 Agregar labels i18n para "Copiar"/"Copiado" y encabezado del snippet en `dict.ts`
- [ ] 2.7 Verificar: en un demo de poca altura con muchos controles, todos son visibles; el snippet refleja solo lo modificado y se copia correctamente

## 3. Fix 3 — Scaffolding por demo + modo full-bleed

- [x] 3.1 Extender el descriptor de layout en `docs/src/content.ts` (`DemoModule`) para admitir modo full-bleed además de `frame`/`flow`
- [x] 3.2 En `ComponentPage.tsx` + CSS, aplicar la clase/behavior full-bleed (rompe ancho del artículo, scroll contra ventana, panel anclado)
- [x] 3.3 `AnimatedList` (`animated-list.tsx`) y `AutoHeight` (`auto-height.tsx`): envolver en `.docs-demo-stage` para recuperar padding/centrado
- [x] 3.4 `TextScrollReveal` (`text-scroll-reveal.tsx`): agregar recorrido de scroll con espaciadores antes/después (paridad con los spacers de 70vh del test-app)
- [x] 3.5 `StickyScenes` (`sticky-scenes.tsx`): adoptar modo full-bleed; verificar que las escenas no se apilan
- [x] 3.6 `HorizontalScrollSection` (`horizontal-scroll-section.tsx`): adoptar modo full-bleed; verificar scroll horizontal y sin desborde del documento
- [x] 3.7 `ScribbleDecoration` (`scribble-decoration.tsx`): renderizar sobre caja con dimensiones explícitas (patrón 200×120 del test-app) en vez de overlay sobre texto inline
- [x] 3.8 `ImageDissolve` (`image-dissolve.tsx`): portar el generador de PNG por canvas con números 1/2/3 dibujados, reemplazando el SVG data-URI que taintea el canvas
- [x] 3.9 `Marquee` (`marquee.tsx`): alinear layout con el del test-app (`position:absolute; inset:0` centrado); verificar en runtime la causa de los mensajes de consola / jank y acotar el fix
- [ ] 3.10 Verificar cada demo contra su gemelo del test-app (paridad visual y funcional)

## 4. Cierre

- [x] 4.1 `npm run build` de `docs/` sin errores de tipos ni de bundle
- [ ] 4.2 Recorrido de verificación en runtime de los 8 demos + panel (reset, builder, no-recorte, no-fuga de estado)
- [ ] 4.3 Actualizar `openspec/specs/docs-site/spec.md` al archivar el change
