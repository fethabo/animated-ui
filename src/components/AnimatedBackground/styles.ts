export function animatedBackgroundCss() {
  return `
.aui-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .aui-bg:not([data-aui-motion]),
  .aui-bg:not([data-aui-motion])::before,
  .aui-bg:not([data-aui-motion])::after {
    animation: none !important;
  }
}
`
}
