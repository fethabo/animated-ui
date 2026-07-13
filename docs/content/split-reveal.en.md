---
title: SplitReveal
description: Splits text into char, word or line and reveals each unit with stagger, on mount or on entering the viewport.
---

## Features

- Splits the text into units (`char`, `word` or `line`) and reveals each with stagger. The entrance is a pure CSS transition (zero JS per frame): JavaScript only toggles an attribute.
- Three entrance presets (`slide-up`, `fade`, `blur`) and two triggers: `'mount'` or `'in-view'` (via IntersectionObserver).
- Pre-hydration and accessibility: the text renders complete and visible from the first paint (SSR/SEO) and is split into spans only after hydration. The root carries the full text in `aria-label` and the units are `aria-hidden`.
- `line` mode: splitting by line depends on the real wrapping (width, loaded font); it is measured after mount and re-measured on resize.
- Accepts any valid `<span>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-split-duration` | `0.6s` | Transition duration of each unit. |
| `--aui-split-stagger` | `0.05s` | Incremental delay between units. |
| `--aui-split-distance` | `16px` | Initial offset of the `slide-up` preset. |
| `--aui-split-blur` | `8px` | Initial blur of the `blur` preset. |
| `--aui-split-easing` | `cubic-bezier(0.22, 1, 0.36, 1)` | Transition curve (CSS only). |

## Limitations

- `text` is a plain string (not `children`): the component splits it into units.
- Re-triggering (`once={false}`) only applies with `trigger='in-view'`.
- `--aui-split-i` is a runtime variable (per-unit index, or line index in `line` mode); do not set it by hand.
- With `prefers-reduced-motion` enabled it shows the full text immediately, with no stagger or animation.
