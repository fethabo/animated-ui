---
title: AnimatedBackground
description: CSS-only animated background (no per-frame JS), with aurora, mesh, noise, beam, lava, grid, rays and dots variants.
---

## Features

- Rendered with pure CSS, no per-frame JavaScript: positioned `absolute, inset: 0` to cover its `position: relative` container, or the full viewport with `fixed`.
- Eight visual variants with attractive defaults: `aurora`, `mesh`, `noise`, `beam`, `lava`, `grid`, `rays` and `dots`.
- Each variant exposes its colors, speed and intensity both via props (`colors`, `speed`, `intensity`) and via CSS custom properties, overridable in the cascade.
- `lava` variant: opaque blobs that rise and fall, merging with the "gooey" trick (`filter: blur() + contrast()`), evoking a lava lamp.
- `grid` / `rays` / `dots` variants: retro-synthwave grid in perspective (looped by exact cell period, no jump), light beams that rotate back and forth from a top vertex, and a dot lattice with a soft opacity/scale pulse.
- Accepts any valid `<div>` HTML prop.

## CSS Custom Properties

All can be overridden from your CSS in the cascade, e.g. `.my-bg { --aui-aurora-speed: 20s; }`.

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-aurora-color-1` | `#5b21b6` | First aurora gradient (violet). |
| `--aui-aurora-color-2` | `#0ea5e9` | Second gradient (cyan). |
| `--aui-aurora-color-3` | `#10b981` | Third gradient (green). |
| `--aui-aurora-color-4` | `#ec4899` | Fourth gradient (pink). |
| `--aui-aurora-speed` | `14s` | Duration of a full cycle. |
| `--aui-aurora-blur` | `60px` | Blur that diffuses the gradients. |
| `--aui-aurora-opacity` | `1` | Global effect intensity. |
| `--aui-mesh-color-1` | `#7c3aed` | Top-left blob (violet). |
| `--aui-mesh-color-2` | `#db2777` | Top-right blob (magenta). |
| `--aui-mesh-color-3` | `#2563eb` | Bottom-right blob (blue). |
| `--aui-mesh-color-4` | `#0d9488` | Bottom-left blob (teal). |
| `--aui-mesh-speed` | `18s` | Duration of a morphing cycle. |
| `--aui-mesh-blur` | `40px` | Blur that melts the blobs together. |
| `--aui-mesh-opacity` | `1` | Global effect intensity. |
| `--aui-noise-base` | `#0a0a0a` | Base background color under the grain. |
| `--aui-noise-opacity` | `0.12` | Grain opacity (intensity). |
| `--aui-noise-speed` | `0.6s` | Grain flicker speed. |
| `--aui-beam-base` | `#050510` | Background color behind the beams. |
| `--aui-beam-color-1` | `rgba(124, 58, 237, 0.45)` | First light beam. |
| `--aui-beam-color-2` | `rgba(14, 165, 233, 0.35)` | Second light beam. |
| `--aui-beam-color-3` | `rgba(236, 72, 153, 0.3)` | Third light beam. |
| `--aui-beam-speed` | `16s` | Duration of a full rotation. |
| `--aui-beam-blur` | `24px` | Blur that softens the beam edges. |
| `--aui-beam-opacity` | `1` | Global effect intensity. |
| `--aui-lava-base` | `#160a2b` | Opaque background color behind the blobs. |
| `--aui-lava-color-1` | `#ff4d6d` | First blob color. |
| `--aui-lava-color-2` | `#ff924d` | Second blob color. |
| `--aui-lava-speed` | `16s` | Duration of a full rise/fall. |
| `--aui-lava-blur` | `16px` | Blur of the gooey trick. |
| `--aui-lava-contrast` | `16` | Contrast that "hardens" the blur edges (gooey merge). |
| `--aui-lava-size` | `280px` | Base diameter of the blobs. |
| `--aui-lava-opacity` | `1` | Global effect intensity. |
| `--aui-grid-line` | `rgba(124, 58, 237, 0.5)` | Color of the synthwave grid lines. |
| `--aui-grid-base` | `#050510` | Background / sky color. |
| `--aui-grid-glow` | `rgba(236, 72, 153, 0.35)` | Horizon glow. |
| `--aui-grid-cell` | `48px` | Grid cell side. |
| `--aui-grid-speed` | `8s` | Duration of a full cell advance. |
| `--aui-grid-opacity` | `1` | Global effect intensity. |
| `--aui-rays-color-1` | `rgba(251, 191, 36, 0.4)` | First light beam. |
| `--aui-rays-color-2` | `rgba(249, 115, 22, 0.28)` | Second light beam. |
| `--aui-rays-color-3` | `rgba(236, 72, 153, 0.22)` | Third light beam. |
| `--aui-rays-base` | `#050510` | Background color. |
| `--aui-rays-speed` | `18s` | Duration of a full sweep (back and forth). |
| `--aui-rays-blur` | `18px` | Blur that softens the beams. |
| `--aui-rays-opacity` | `1` | Global effect intensity. |
| `--aui-dots-color` | `rgba(124, 58, 237, 0.7)` | Dot color. |
| `--aui-dots-base` | `#050510` | Background color. |
| `--aui-dots-size` | `2px` | Radius of each dot. |
| `--aui-dots-cell` | `28px` | Lattice spacing. |
| `--aui-dots-speed` | `4s` | Duration of a full pulse. |
| `--aui-dots-opacity` | `1` | Global intensity (pulse peak). |

## Limitations

- The `lava` variant uses `filter` over large areas, which has a paint cost: it performs better in bounded containers than full-screen on low-end devices.
- It is a decorative background: it carries no content of its own, mount it inside a `position: relative` container (or use `fixed`) and layer your content on top.
- With `prefers-reduced-motion` it shows the static gradient, no animation (unless you set `respectReducedMotion={false}`).
