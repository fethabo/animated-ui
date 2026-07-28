export function glitchTextCss() {
  return `
.aui-glitch {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}
.aui-glitch::before,
.aui-glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
.aui-glitch::before {
  color: var(--aui-glitch-color-1, #ff004d);
}
.aui-glitch::after {
  color: var(--aui-glitch-color-2, #00fff9);
}
@media (prefers-reduced-motion: reduce) {
  .aui-glitch:not([data-aui-motion])::before,
  .aui-glitch:not([data-aui-motion])::after {
    animation: none !important;
  }
  .aui-glitch:not([data-aui-motion])[data-aui-trigger='hover']:hover::before {
    opacity: 0.55;
    transform: translateX(calc(-1 * var(--aui-glitch-intensity, 3px)));
  }
  .aui-glitch:not([data-aui-motion])[data-aui-trigger='hover']:hover::after {
    opacity: 0.55;
    transform: translateX(var(--aui-glitch-intensity, 3px));
  }
}
`
}
