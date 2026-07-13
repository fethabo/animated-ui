---
title: FireworksBurst
description: One-shot fireworks: rockets that ascend with a wobble and explode at the apex, fired imperatively via ref.
---

## Features

- Imperative one-shot: it does not animate on mount. Each `fire(options?)` launches one or more rockets from `origin` (defaults to bottom-center) that ascend with a lateral wobble and explode at the apex into radial sparks that fall with gravity and fade out.
- Passive `<canvas>` overlay (`absolute, inset: 0`, `pointer-events: none`): clicks pass through to the content. The RAF starts with the first `fire()` and stops when the last spark dies — zero cost at rest.
- Several rockets per burst (`rockets`) take off staggered; successive shots accumulate on the same canvas.
- The props are the defaults for each shot; `fire(options?)` accepts `rockets`, `particleCount`, `colors`, `origin`, `power` and `gravity`, and overrides them for that burst only.
- Randomness uses the package's seedable PRNG (varies between shots, no `Math.random`). The `FireworksBurstHandle` type types the ref in TypeScript.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-fireworks-color-<i>` | color `i` of `colors` | Overrides color `i` of the default palette from cascading CSS (does not affect `colors` passed to `fire()`). |

## Limitations

- The fireworks are clipped to the component's container; to cover the full viewport, mount it in a `position: fixed; inset: 0` container.
- With `prefers-reduced-motion` enabled (and `respectReducedMotion` at its default), `fire()` is a no-op: they are a self-contained celebration with no useful static version. If your flow still needs feedback, handle it outside the component.
- `fire()` before hydration (or with no canvas available) is a safe no-op.
