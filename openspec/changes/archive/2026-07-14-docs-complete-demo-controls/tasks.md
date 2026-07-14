# Tasks: docs-complete-demo-controls

## 1. Infraestructura: validación de cobertura + panel flow

- [x] 1.1 Crear `docs/scripts/control-exclusions.mjs`: exclusión por heurística (tipo función/`ReactNode`/`ElementType`, `className`/`style`), global por nombre (`seed`, `target`, `src`, `alt`, `children`) y por componente (`controlsExclude[slug]` para `words`/`text`/`emojis`/`charset`/`cellColor`/`easing`/etc.)
- [x] 1.2 Validación de cobertura en `build-content.mjs`: parsear los `prop:` del array `controls` de cada `src/demos/<slug>.tsx` (regex sobre literal), cruzar contra `props.json` menos exclusiones; error (o warning en `--lax`) por demo sin controles o prop controlable sin control; mensaje con slug + prop
- [x] 1.3 `ControlPanel` soporta panel fijo: prop `fixed?: boolean` → `position: fixed` (esquina viewport) para demos `flow`; `ComponentPage` pasa `fixed={demoFlow}`

## 2. Completar colores/props en los 19 demos que ya tienen controles

- [x] 2.1 Agregar controles de color faltantes: animated-background (`colors` multi), waves-background (`colors` multi), flow-field (`colors` multi + `background`), shiny-text (`color`/`highlight` ya? verificar), rotating-text (`color`), glitch-text (`colors` multi), scribble-decoration (`color` ya), guiding-branches (`color` ya), particle-field (`color` ya + `linkColor`), confetti/fireworks/sparkle/emoji (`colors`/paleta), dock/marquee/split-reveal/scroll-reveal/tilt-card/wavy-text (revisar props faltantes)
- [x] 2.2 Completar props controlables no-color faltantes en esos 19 según cobertura (que la validación 1.2 quede en verde para ellos)

## 3. Agregar controles a los 31 demos sin controles

- [x] 3.1 Tarjetas & Mouse: border-beam, glow-border, spotlight-card, ripple-container, magnetic-element, tesla-coil (recibir props + spread + `controls` con colores y escalares; respetar el patrón de estilo en hijo donde aplique)
- [x] 3.2 Backgrounds: circuit-background, matrix-rain, starfield-background, topographic-background, pixel-background (excluir `cellColor` función; `color`/`background`/`colors` como corresponda)
- [x] 3.3 Cursor/Idle: cursor-trail, custom-cursor, image-trail, click-spark, attention-cue
- [x] 3.4 Texto: count-up, scramble-text, typewriter-text, text-highlighter, text-scroll-reveal (los de trigger mount re-montan por key incluyendo props)
- [x] 3.5 Scroll/Parallax: scroll-progress, mouse-parallax, parallax-layers, image-dissolve, y los `flow` sticky-scenes/stacked-cards/horizontal-scroll-section (con panel fijo)
- [x] 3.6 Layout: animated-list, auto-height, draw-path

## 4. Verificación

- [x] 4.1 `npm run build` (docs) estricto: la validación de cobertura pasa para los 50 demos + `tsc --noEmit` OK
- [x] 4.2 QA en browser (Playwright/Chrome): un color simple varía en vivo; una paleta `multi` varía en vivo; un demo antes-sin-control ahora tiene panel completo; panel fijo alcanzable en un demo `flow`; sin errores de runtime
