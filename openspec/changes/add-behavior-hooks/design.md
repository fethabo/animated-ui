# add-behavior-hooks — Design

## Context

Los cuatro efectos de la familia pointer (TiltCard, MagneticElement, SpotlightCard, GlowBorder) ya son imperativos: operan sobre refs con WAAPI o CSS vars, sin re-render por frame. Pero el comportamiento está fusionado al wrapper DOM que el componente posee, así que no puede aplicarse al elemento de un tercero (una `Card` de MUI, un botón propio) sin introducir un `<div>` extra.

Estructura actual por efecto:

- **TiltCard** (`src/components/TiltCard/index.tsx`): dos divs (outer con `perspective`, inner con `preserve-3d` que rota via `element.animate()`); render prop opcional con `TiltState`; `glare` agrega un overlay hijo.
- **MagneticElement** (`src/components/MagneticElement/index.tsx`): div outer con `padding: hitArea` como zona de atracción (sin listeners globales) + div inner que se traslada via WAAPI.
- **SpotlightCard** (`src/components/SpotlightCard/index.tsx`): div root que trackea el mouse en CSS vars + overlay hijo `.aui-spotlight-overlay` con el radial-gradient.
- **GlowBorder** (`src/components/GlowBorder/index.tsx`): div root `.aui-glow` (padding perimetral + `overflow: hidden`) + capa cónica hija + wrapper `.aui-glow-content` cuyo background tapa el centro del gradiente.

Restricciones vinculantes del proyecto: cero deps de runtime, zero-config (CSS via `injectStyles`), `'use client'` + SSR-safe, `respectReducedMotion` default `true`, CSS vars `--aui-*`, tree-shaking por subpath exports.

## Goals / Non-Goals

**Goals:**

- Un modo de consumo por hook, genérico: funciona con cualquier componente/elemento que exponga un nodo DOM via `ref` (MUI, Chakra, Mantine, HTML plano). Ningún contrato específico a una UI library.
- Una sola implementación por efecto: componente y hook comparten el mismo motor; cero divergencia de comportamiento.
- API pública y DOM renderizado de los 4 componentes existentes sin cambios (no breaking).
- Contrato "mejorar y restaurar": al desmontar, el host queda exactamente como estaba.

**Non-Goals:**

- No se agrega ninguna capa de integración específica a MUI (ni imports, ni presets `sx`, ni fragmentos de theme). Si la prueba en entornos reales lo justifica, será un change futuro.
- No se migran efectos estructurales (los que poseen contenido o estructura: Marquee, SplitReveal, listas FLIP, etc.) — no califican para modo hook por definición.
- No se introduce patrón `asChild`/Slot ni prop `component` (candidatos de roadmap, decisión posterior).
- No se agregan hooks para los fondos canvas en este change.

## Decisions

### 1. Motor imperativo por efecto + hook fino + componente fino

Cada efecto extrae su lógica a un módulo motor co-locado (`src/components/<Nombre>/engine.ts`) con contrato `attach(host, options) → { update(patch), destroy() }`. El motor es DOM puro (testeable con jsdom, sin React). Sobre él se construyen:

- el **hook público** (`use-tilt.ts`, etc.): callback ref + ciclo de vida React + `useReducedMotion`;
- el **componente existente**: conserva su DOM y props actuales, delega la lógica en el motor.

*Alternativa descartada:* que el componente consuma el hook directamente. Falla en los casos donde el DOM del componente difiere del modo hook (TiltCard rota el div inner, no el root; MagneticElement traslada el inner). El motor común con dos consumidores resuelve ambos sin forzar un DOM único.

*Alternativa descartada:* un registry central de efectos (`attach(el, 'tilt', opts)`). Sobredimensionado para 4 efectos y rompe el tree-shaking por subpath (el registry arrastraría todos los efectos registrados).

### 2. El hook devuelve un callback ref

`const tiltRef = useTilt(options)` devuelve `(node: HTMLElement | null) => void`. Callback ref (no ref object) porque maneja el caso de nodo que cambia de identidad entre renders: al recibir un nodo nuevo destruye la instancia anterior y ata la nueva; al recibir `null` destruye. El cleanup de desmontaje se cubre con `useEffect` de montaje único (compatible React 18; no se depende del cleanup de callback refs de React 19). Debe ser idempotente bajo StrictMode (attach → destroy → attach sin fugas).

Para componer con la ref propia del consumer se documenta el patrón estándar de merge de refs; no se incluye util pública de merge en este change.

### 3. Enhance-and-restore: qué puede tocar el hook en el host

Contrato único, implementado en un helper compartido:

- Setear CSS vars `--aui-*` inline (y removerlas en destroy).
- Agregar clases con namespace `aui-` (y removerlas).
- Forzar `position: relative` **solo si** el computed style es `static`, restaurando el valor inline previo en destroy.
- Inyectar capas hijas propias (`aria-hidden`, `pointer-events: none`) al final del host cuando el efecto lo requiere, removiéndolas por referencia en destroy.
- Listeners solo sobre el host (nunca globales/window).

Prohibido explícitamente: leer o escribir `innerHTML` del host, reordenar o envolver los children del consumer (React es dueño de ese subárbol; las capas inyectadas son nodos que React nunca reconcilia porque no los creó — se documenta que remontar el host por `key` en cada render es responsabilidad del consumer evitarlo).

### 4. Estrategia DOM por efecto en modo hook

| Hook | DOM extra | Diferencia vs componente |
|---|---|---|
| `useTilt` | ninguno | la perspectiva entra en el propio transform (`perspective(N) rotateX() rotateY()`) en lugar del div outer; **`glare` no disponible** (requiere overlay + preserve-3d) |
| `useMagnetic` | ninguno | WAAPI `translate` sobre el host; **`hitArea` no disponible** (la zona extendida requiere el wrapper de padding; el criterio "sin listeners globales" manda) |
| `useSpotlight` | overlay hijo inyectado | idéntico al componente; el overlay hereda `border-radius` del host |
| `useGlowBorder` | capa cónica hija inyectada | no existe el wrapper `.aui-glow-content`: el contenido del consumer debe aportar su propio background para tapar el centro del gradiente; el hook aplica al host padding perimetral (`--aui-glow-width`), `overflow: hidden` e `isolation` |

Las opciones no disponibles en modo hook se omiten del tipo de opciones del hook (error de compilación, no fallo silencioso).

### 5. Reduced motion vive en el hook, no en el motor

El motor recibe un flag `reducedMotion` en `options` y lo respeta de forma pasiva. El hook compone `useReducedMotion()` con la opción `respectReducedMotion` (default `true`) y llama `update()` cuando la preferencia cambia. Así el motor queda puro y testeable, y el componente reutiliza su lógica actual sin duplicar la suscripción al media query.

### 6. Actualización de opciones en vivo con fast-path

El hook diffea las opciones por shallow-compare en cada render (las opciones son escalares y arrays cortos; sin `JSON.stringify`). Si cambian, llama `engine.update(patch)`: los cambios que solo afectan CSS vars se re-aplican sin reconstruir listeners ni capas; los que cambian el cableado (p.ej. `followCursor` en glow) reconstruyen internamente. El consumer no necesita memoizar el objeto de opciones.

### 7. Exports y empaquetado

Cada hook se exporta desde el `index.tsx` de su componente y desde el barrel `src/index.ts`. Así `import { useTilt } from '@fethabo/animated-ui/tilt-card'` funciona sin entries nuevos en `tsup.config.ts` y el tree-shaking por subpath se preserva. El CSS necesario (overlay de spotlight, capa de glow) se sigue inyectando via `injectStyles` desde el motor en el primer `attach` — zero-config intacto.

## Risks / Trade-offs

- **[Paridad del refactor]** Los 4 componentes deben comportarse pixel-perfect igual tras delegar en el motor → los tests existentes se mantienen verdes sin modificarse, más verificación visual en `test-app` lado a lado (componente vs hook).
- **[Capas hijas que React no conoce]** Las capas inyectadas conviven con children reconciliados por React; si el consumer remonta el host (cambio de `key`), el callback ref se re-ejecuta y el motor re-inyecta — pero un render que reemplace children puede dejar la capa mal posicionada respecto al orden. Mitigación: capas `position: absolute; inset: 0` insensibles al orden + documentación del caveat.
- **[Contrato del host en useGlowBorder]** El hook pisa `padding` y `overflow` del host; un host con padding propio pierde su layout → se documenta como contrato (el padding perimetral ES el ancho del glow) y se recomienda el componente para quien no pueda cederlo.
- **[Opciones con funciones]** Callbacks del consumer (p.ej. futuros `onChange`) romperían el shallow-compare → este change no expone callbacks en opciones; si un change futuro los agrega, se excluyen del diff.
- **[StrictMode]** Doble attach/destroy en desarrollo → el motor debe ser idempotente y sin efectos residuales (verificado por test).
- **[Superficie de docs duplicada]** Cada efecto pasa a tener dos modos documentados → el costo se acota documentando el modo hook como sección del componente existente (README y docs site), no como página aparte.

## Migration Plan

Cambio aditivo, sin breaking. Orden de implementación: (1) helper enhance-and-restore compartido; (2) un efecto de punta a punta (TiltCard: motor + hook + componente refactorizado + tests) para validar el patrón; (3) los otros tres efectos; (4) docs/README/examples/test-app. Rollback: quitar los exports de hooks; los componentes refactorizados sobre el motor siguen funcionando igual.

## Open Questions

- ¿Exponer el estado de animación del hook (equivalente al render prop `TiltState`/`MagneticState`)? Deferido: exige callbacks en opciones o un modo suscripción; se decide con feedback de uso real.
- ¿`useDock` y hooks para fondos canvas? Fuera de scope; evaluar tras validar esta tanda.
- Naming del helper compartido (`enhanceHost` vs `attachBehavior`) — decisión de implementación.
