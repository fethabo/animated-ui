export function borderBeamCss() {
  return `
.aui-border-beam {
  position: relative;
}
.aui-border-beam-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--aui-beam-border-width, 2px);
  mask-image: linear-gradient(#000, #000), linear-gradient(#000, #000);
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
  pointer-events: none;
}
.aui-border-beam-comet {
  position: absolute;
  width: var(--aui-beam-size, 96px);
  height: var(--aui-beam-border-width, 2px);
  border-radius: 999px;
  background: linear-gradient(
    to right,
    transparent,
    var(--aui-beam-color-to, #0ea5e9),
    var(--aui-beam-color-from, #7c3aed)
  );
  offset-path: border-box;
  offset-anchor: 100% 50%;
  animation: aui-border-beam-travel var(--aui-beam-duration, 6s) linear infinite;
  animation-delay: var(--aui-beam-delay, 0s);
}
@keyframes aui-border-beam-travel {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}
@supports not (offset-path: border-box) {
  .aui-border-beam-comet { display: none; }
}
@supports not (mask-composite: intersect) {
  .aui-border-beam-comet { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  /* Reduced motion: sin cometa; realce de borde estático sutil en la capa. */
  .aui-border-beam:not([data-aui-motion]) > .aui-border-beam-layer {
    box-shadow: inset 0 0 0 var(--aui-beam-border-width, 2px) var(--aui-beam-color-from, #7c3aed);
    opacity: 0.35;
  }
  .aui-border-beam:not([data-aui-motion]) .aui-border-beam-comet {
    display: none;
  }
}
`
}
