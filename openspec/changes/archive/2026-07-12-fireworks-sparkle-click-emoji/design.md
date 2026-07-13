## Context

Wave I (ConfettiBurst) fijó el **patrón one-shot imperativo** como convención del paquete (AGENTS.md): overlay pasivo `pointer-events:none`, handle tipado via `useImperativeHandle` con `fire(options?)`, props = defaults / options por disparo, RAF que arranca al disparar y se auto-detiene con el pool vacío, PRNG seedable por contador interno, no-op antes de hidratación / sin canvas / bajo reduced motion. Wave J aplica ese patrón a cuatro efectos nuevos. No hay decisión arquitectónica nueva; las decisiones de este design son de **factorización** (cuánto esqueleto compartir) y de **contrato** (ClickSpark es declarativo, no imperativo).

## Goals / Non-Goals

**Goals:**

- Cuatro componentes de celebración/feedback cumpliendo el patrón one-shot de AGENTS.md y la spec `component-authoring`.
- Física de cada efecto en módulos puros testeables (patrón `physics.ts` de ConfettiBurst).
- Evaluar y, si es limpia, ejecutar la extracción del esqueleto común desde ConfettiBurst sin cambiar su comportamiento ni su spec.

**Non-Goals:**

- No se generaliza a un "motor de partículas" público: el esqueleto compartido (si se extrae) es interno.
- No hay versión estática bajo reduced motion (convención de la categoría: el disparo es no-op; el feedback alternativo corre por cuenta del consumer).
- No se agregan sonidos, vibración ni assets externos.
- No se modifica la API pública de ConfettiBurst.

## Decisions

### 1. Esqueleto compartido: extracción condicionada, no prematura

El ciclo overlay+canvas+resize / pool / RAF auto-detenible / seed por contador se repite en los cuatro componentes. Se intenta extraer de ConfettiBurst a un módulo interno (`src/components/shared/one-shot-overlay.ts` o hook `useOneShotCanvas`) **solo si** la extracción no obliga a parametrizar en exceso (regla: si el módulo compartido necesita más de ~3 callbacks/opciones para cubrir los cinco consumers, se descarta y cada componente replica el esqueleto, que es corto). Alternativa considerada: extraer siempre — rechazada porque una abstracción forzada es más cara de mantener que ~100 líneas repetidas con tests propios.

### 2. FireworksBurst: física en dos fases dentro del mismo pool

Cada cohete es una partícula fase `rocket` (ascenso con leve wobble) que al alcanzar su apex se reemplaza por N partículas fase `spark` (velocidades radiales + gravedad + drag + fade por vida). Un solo pool tipado por fase evita dos RAF/loops. `fire()` puede lanzar varios cohetes con delay escalonado (option `rockets`). Alternativa: animar el estallido con keyframes CSS por partícula — rechazada (cientos de nodos DOM; el canvas ya es la convención de la categoría).

### 3. SparkleBurst: estrellas por path, sin glifos

Las estrellas de 4 puntas se dibujan con path canvas (dos curvas cuadráticas por punta) escaladas por una envolvente de vida (crece rápido → encoge), con rotación individual. Alternativa `fillText('✦')` — rechazada: el glifo varía por plataforma/fuente y no permite controlar el grosor; el path es determinista y barato.

### 4. EmojiBurst: `fillText` con física de confetti reutilizada

Los emojis sí se renderizan con `fillText` (es exactamente el caso de uso correcto: el emoji nativo de la plataforma es el look esperado). La física reutiliza el módulo de abanico/gravedad/drag de ConfettiBurst si la extracción (decisión 1) prospera; el tumbling se limita a rotación 2D (`ctx.rotate`) sin el flip 3D de los papelitos. El `font` del contexto se setea una vez por tamaño, no por partícula.

### 5. ClickSpark es declarativo: listener propio, sin handle

ClickSpark rompe deliberadamente con el handle imperativo: su valor es "envolvé tu contenido y cada click chispea", sin refs ni wiring. Monta el mismo overlay pasivo y un listener `pointerdown` en el contenedor (los `children` permanecen interactivos: el overlay es `pointer-events:none`, el listener va en el wrapper). Comparte el motor interno de partículas one-shot. Alternativa: exponer también `fire()` — rechazada por ahora para mantener una API mínima; si surge demanda se agrega como aditivo.

### 6. Reduced motion y SSR: convención de la categoría sin excepciones

Los cuatro componentes son no-op bajo `prefers-reduced-motion` (incluido ClickSpark: aunque el click es input directo, la ráfaga es movimiento decorativo no esencial), no acceden a `window`/`document` en render, y llevan `'use client'`.

## Risks / Trade-offs

- [La extracción del esqueleto toca ConfettiBurst, componente publicado] → la extracción es refactor puro con sus tests existentes como red; si algún test de ConfettiBurst requiere cambios de comportamiento, la extracción se aborta (decisión 1).
- [Emojis renderizan distinto por plataforma (Windows/Android/iOS)] → documentado en README como comportamiento esperado; el consumer elige los emojis.
- [Varios bursts simultáneos en la misma página (e.g. ClickSpark + FireworksBurst)] → cada componente tiene su propio canvas/RAF aislado; sin registro global (convención existente).
- [`fillText` por partícula es más caro que `fillRect`] → pools de EmojiBurst más chicos por defecto (~30 vs ~150 de confetti); documentado en la prop `count`.

## Migration Plan

Cambio aditivo: componentes nuevos + refactor interno opcional de ConfettiBurst. Sin pasos de migración para consumers. Rollback = no publicar los exports nuevos.

## Open Questions

- Ninguna bloqueante. El umbral exacto de "extracción limpia" (decisión 1) se resuelve en la primera task de implementación con el código a la vista.
