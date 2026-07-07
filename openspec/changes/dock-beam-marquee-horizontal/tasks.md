## 1. Dock

- [x] 1.1 Crear `src/components/Dock/types.ts` (`magnification`, `radius`, `gap`, `orientation`, `respectReducedMotion`, `className`, `style`; `Dock.Item` con props HTML de su root)
- [x] 1.2 Crear `src/components/Dock/magnify.ts`: cálculo puro del factor de escala por distancia (campana `cos` recortada sobre `radius`) + tests vitest (pico en el cursor, cero fuera del radio, simetría)
- [x] 1.3 Crear `src/components/Dock/index.tsx`: `'use client'`, composición `Dock` + `Dock.Item`, tracking `mousemove` por ref (sin re-renders), `scale`/`translate` directo al style de cada ítem, retorno con transition CSS al salir, orientación horizontal/vertical, reduced motion = estático, CSS vars `--aui-dock-*`
- [x] 1.4 Test `index.ssr.test.ts` + verificación de foco/teclado intactos

## 2. BorderBeam

- [x] 2.1 Crear `src/components/BorderBeam/types.ts` (`colorFrom`, `colorTo`, `size`, `duration`, `delay`, `borderWidth`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 2.2 Crear `src/components/BorderBeam/index.tsx`: `'use client'`, cometa con `offset-path: border-box` + `offset-distance` animado via `injectStyles`, degradación `@supports` (sin cometa), capa `pointer-events:none`, realce estático bajo reduced motion, CSS vars `--aui-beam-*`
- [x] 2.3 Test `index.ssr.test.ts`

## 3. Marquee

- [x] 3.1 Crear `src/components/Marquee/types.ts` (`direction`, `speed`, `pauseOnHover`, `scrollVelocity`, `gap`, `fadeEdges`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 3.2 Crear `src/components/Marquee/index.tsx`: `'use client'`, pista con contenido duplicado (`aria-hidden` en copias), keyframes de translate via `injectStyles`, repetición hasta llenar el contenedor (medición única con `useResizeObserver`), `pauseOnHover` con `animation-play-state`, máscara `fadeEdges`, reduced motion = estático, CSS vars `--aui-marquee-*`
- [x] 3.3 Modo `scrollVelocity`: derivar velocidad de scroll en el scroll-driver (extensión interna sin listeners nuevos) y modular velocidad/skew via CSS vars; suscripción solo con la prop activa
- [x] 3.4 Test `index.ssr.test.ts` + test del cálculo de repeticiones (lógica pura)

## 4. HorizontalScrollSection

- [x] 4.1 Crear `src/components/HorizontalScrollSection/types.ts` (`children`, multiplicador de recorrido/`speed`, `respectReducedMotion`, `className`, `style`)
- [x] 4.2 Crear `src/components/HorizontalScrollSection/index.tsx`: `'use client'`, root con altura de recorrido + inner sticky `100dvh`, scroll-driver escribiendo `--aui-hscroll-progress`, fila con `translateX(calc(...))` compositado, `travel` medido con `useResizeObserver`, tracking activo solo cerca del viewport (`useInView`), reduced motion = paneles apilados verticalmente
- [x] 4.3 Test `index.ssr.test.ts` + test del mapeo progreso→desplazamiento (lógica pura)

## 5. AnimatedBackground: variantes grid / rays / dots

- [x] 5.1 Crear `variants/grid.ts`, `variants/rays.ts`, `variants/dots.ts` en `src/components/AnimatedBackground/` con el contrato existente (CSS generado + defaults de `colors`/`speed`/`intensity`, vars `--aui-grid-*`/`--aui-rays-*`/`--aui-dots-*`, composición estática bajo reduced motion)
- [x] 5.2 Ampliar el union type de `variant` y el registro de variantes; verificar que los tests existentes de AnimatedBackground pasan
- [x] 5.3 Tests de los generadores de CSS de las tres variantes

## 6. Exports y documentación

- [x] 6.1 Exportar `Dock`, `BorderBeam`, `Marquee`, `HorizontalScrollSection` y sus tipos desde `src/index.ts`; agregar entry points a `package.json#exports` y `tsup.config.ts`
- [x] 6.2 Documentar en README: secciones nuevas por componente + actualización de la sección AnimatedBackground (variantes y vars nuevas); notas de touch (Dock) y contenido angosto (Marquee)
- [x] 6.3 Crear ejemplos standalone en `/examples` para los cuatro componentes (solo React)
- [x] 6.4 Marcar Wave G ✅ en `ROADMAP.md` (Tier 1: Dock, BorderBeam; Tier 3: Marquee, HorizontalScrollSection; Extensiones: variantes)

## 7. Verificación (definition-of-done)

- [x] 7.1 Demo + descriptor de controles en `test-app` por componente nuevo (incluye `respectReducedMotion`) y variantes nuevas en el demo de AnimatedBackground; alta en `demos/index.js`
- [ ] 7.2 Verificación visual: magnificación y retorno del Dock (horizontal/vertical), cometa siguiendo esquinas redondeadas, marquee sin costura con pausa en hover y modo velocity, scroll horizontal reversible con resize
- [x] 7.3 Correr vitest completo + typecheck + build; confirmar tree-shaking
- [x] 7.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar
