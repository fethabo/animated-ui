---
title: CountUp
description: A number that counts from `from` to `value` on entering the viewport, with ease-out.
---

## Features

- Counts from `from` to `value` on entering the viewport, with ease-out (fast start, braking on arrival). The count runs once per mount.
- The RAF mutates `textContent` via ref (`ScrambleText` pattern): zero re-renders per frame.
- SEO-safe: the SSR markup contains the final formatted value (correct without JavaScript and for crawlers); the text resets to the initial value only when the count starts.
- Accessible: the root exposes the final value in `aria-label`, so screen readers announce the definitive value and not the intermediate ones.
- Formatting with `decimals`, thousands `separator`, `prefix` and `suffix`.
- Accepts any valid `<span>` HTML prop.

## Limitations

- Variable-width digits can make the layout "dance" during the count. Apply `font-variant-numeric: tabular-nums` to the component (or its container) for a stable width.
- The count runs once per mount: to re-trigger it you must remount the component (for example, by changing its `key`).
- With `prefers-reduced-motion` enabled it shows the final value directly (matching the SSR markup — zero visual jump).
