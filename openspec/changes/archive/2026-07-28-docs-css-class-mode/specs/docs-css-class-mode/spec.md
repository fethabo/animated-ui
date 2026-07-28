## ADDED Requirements

### Requirement: CSS Class Mode Documentation
La aplicación de documentación SHALL incluir explicaciones y ejemplos sobre cómo utilizar el componente utilizando únicamente clases CSS estáticas para los componentes soportados (`AnimatedBackground`, `ShinyText`, `BorderBeam`, `GlitchText`).

#### Scenario: User visits supported component page
- **WHEN** el usuario navega a la página de documentación de `AnimatedBackground`, `ShinyText`, `GlitchText`, o `BorderBeam`
- **THEN** el sitio web expone un bloque de código que ejemplifica el marcado HTML requerido y cómo importar los estilos CSS generados (o utilizar las funciones de registro dinámico).

### Requirement: Accessibility Opt-out Documentation
La aplicación de documentación SHALL detallar el funcionamiento del atributo `data-aui-motion` para evadir temporalmente las restricciones de `prefers-reduced-motion` en el modo de CSS puro.

#### Scenario: User reads CSS mode usage guidelines
- **WHEN** el usuario revisa la guía de uso de CSS mode de un componente
- **THEN** existe una indicación clara sobre cómo usar el atributo nativo `data-aui-motion` para forzar las animaciones si el diseño estricto lo requiere.
