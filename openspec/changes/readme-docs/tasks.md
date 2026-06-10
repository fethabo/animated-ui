## 1. Crear README.md inicial

- [ ] 1.1 Crear `README.md` con nombre del paquete `@fethabo/animated-ui`, descripción de una línea, badge de npm (placeholder), y comando de instalación
- [ ] 1.2 Agregar sección `## Compatibility` declarando: React 18+, Vite / Next.js App Router / Astro, JavaScript y TypeScript
- [ ] 1.3 Agregar sección `## Components` con la tabla resumen de los tres componentes iniciales (`AnimatedBackground`, `PixelBackground`, `TiltCard`) con descripción de una línea y link anchor a cada sección

## 2. Documentar AnimatedBackground

- [ ] 2.1 Agregar sección `## AnimatedBackground` con descripción de 2-4 líneas y ejemplo de uso mínimo en bloque de código JSX
- [ ] 2.2 Agregar tabla de props: `variant`, `colors`, `speed`, `intensity`, `fixed`, `className`, `style`, `respectReducedMotion`
- [ ] 2.3 Agregar subsección `### CSS Custom Properties` con tabla de las variables `--aui-aurora-*`, `--aui-mesh-*`, `--aui-noise-*`, `--aui-beam-*`

## 3. Documentar PixelBackground

- [ ] 3.1 Agregar sección `## PixelBackground` con descripción de 2-4 líneas y ejemplo de uso mínimo en bloque de código JSX
- [ ] 3.2 Agregar tabla de props: `behaviors`, `cellSize`, `gap`, `color`, `cellColor`, `hoverRadius`, `idleIntensity`, `idleSpeed`, `revealDuration`, `respectReducedMotion`, `className`, `style`
- [ ] 3.3 Documentar el tipo del callback `cellColor`: firma `(x: number, y: number, proximity: number, idlePhase: number) => string` con descripción de cada parámetro

## 4. Documentar TiltCard

- [ ] 4.1 Agregar sección `## TiltCard` con descripción de 2-4 líneas, ejemplo con children estáticos, y ejemplo con render prop
- [ ] 4.2 Agregar tabla de props: `maxAngle`, `perspective`, `glare`, `children`, `className`, `style`, `respectReducedMotion`
- [ ] 4.3 Agregar subsección `### TiltState` documentando el objeto de render prop: `tiltX`, `tiltY`, `isHovering`
- [ ] 4.4 Agregar subsección `### CSS Custom Properties` con tabla de `--aui-tilt-perspective`

## 5. Actualizar tasks.md de animated-ui-foundation

- [ ] 5.1 Agregar al grupo 9 (Verificación Final) de `animated-ui-foundation/tasks.md` la tarea: `9.4 Verificar que el README refleja correctamente las props de los tres componentes implementados`
