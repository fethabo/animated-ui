# Tasks: tier-2-text-effects

## 1. ShinyText

- [x] 1.1 Crear `src/components/ShinyText/types.ts` con `ShinyTextProps` (children, color, highlight, speed, angle, respectReducedMotion, className, style + spread de props de `<span>`)
- [x] 1.2 Crear generador de CSS (keyframes de `background-position`, `background-clip: text` con prefijo `-webkit-` y fallback `@supports`) como módulo puro testeable
- [x] 1.3 Implementar `src/components/ShinyText/index.tsx`: `'use client'`, inyección via `injectStyles` en `useEffect`, CSS vars `--aui-shiny-*` inline desde props, loop apagado bajo reduced motion (gradiente estático)
- [x] 1.4 Tests vitest del generador de CSS (incluye fallback `@supports` y dedupe de inyección)

## 2. ScrambleText

- [x] 2.1 Crear `src/components/ScrambleText/types.ts` con `ScrambleTextProps` (text, speed, charset, trigger, respectReducedMotion, className, style + spread de props del root)
- [x] 2.2 Implementar `scrambleFrame(text, revealed, charset, random)` como módulo puro: opera por code points, preserva espacios, aleatoriedad inyectable
- [x] 2.3 Implementar `src/components/ScrambleText/index.tsx`: `'use client'`, render inicial con texto final (SSR-safe, sin mismatch), loop RAF por timestamps que muta `textContent` via ref, root con `aria-label` + span interior `aria-hidden`, `--aui-scramble-color` aplicada durante el scramble y limpiada al terminar
- [x] 2.4 Soportar `trigger: 'mount' | 'hover' | 'both'` y re-scramble al cambiar `text`; bajo reduced motion mostrar texto final directo (hover puede quedar activo)
- [x] 2.5 Tests vitest de `scrambleFrame` (determinismo con random inyectado, espacios, code points/surrogates, revelado completo) + test SSR del componente (patrón `*.ssr.test.ts`)

## 3. Integración del paquete

- [x] 3.1 Exportar `ShinyText`, `ScrambleText` y sus tipos públicos desde `src/index.ts` preservando tree-shaking
- [x] 3.2 Verificar build (`tsup`) y suite completa de tests sin regresiones

## 4. Documentación y ejemplos

- [x] 4.1 Crear `/examples/shiny-text.tsx` standalone (solo React, TypeScript mínimo, sin importar el paquete)
- [x] 4.2 Crear `/examples/scramble-text.tsx` standalone (solo React, TypeScript mínimo, sin importar el paquete)
- [x] 4.3 README: fila en la tabla de componentes, snippet de uso, tabla de props y tabla de CSS custom properties para cada componente; documentar la recomendación de fuente para evitar jitter en ScrambleText y el patrón de wrapping semántico de ShinyText
- [x] 4.4 Actualizar ROADMAP.md: marcar ShinyText y ScrambleText como hechos en la tabla de Tier 2 y en la secuencia de releases

## 5. Verificación final

- [x] 5.1 Agregar ambos componentes a `test-app` y verificar visualmente (loop del brillo, scramble en mount/hover, reduced motion, override de CSS vars en cascada)
- [x] 5.2 Revisar el definition-of-done de `component-authoring` punto por punto antes de dar por completo el change

> Nota: bump de versión y CHANGELOG quedan fuera de este change — los maneja el usuario con tagman.
