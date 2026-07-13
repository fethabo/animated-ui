---
title: MagneticElement
description: Wrapper that pulls its content toward the cursor as it approaches, with an elastic return on leave.
---

## Features

- The translation uses WAAPI with interpolation that preserves momentum (the TiltCard pattern applied to `translate`).
- Exposes its state via render prop — `{ offsetX, offsetY, isActive }` — to build derived effects (shadows, glows, color shifts).
- The attraction zone is enlarged with transparent padding around the content (`hitArea`), which **participates in the layout** of the wrapper. With `hitArea={0}` the wrapper collapses to the content's size and attraction only starts once inside it.
- Accepts any valid `<div>` HTML prop.

## CSS Custom Properties

This component exposes no CSS custom properties: everything is configured through props.

## Limitations

- The attraction is a hover effect: on touch devices there is no interaction.
- With `prefers-reduced-motion` the content does not move (offsets stay at `0`), but `isActive` is still reported.
