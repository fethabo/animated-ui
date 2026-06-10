## ADDED Requirements

### Requirement: Package structure follows tree-shakeable conventions
El paquete SHALL exportar cada componente desde su propio módulo además del barrel export principal, permitiendo a los bundlers eliminar código no utilizado.

#### Scenario: Importar un solo componente no arrastra los demás
- **WHEN** un consumer importa `import { TiltCard } from '@fethabo/animated-ui'`
- **THEN** el bundle final no SHALL incluir código de `AnimatedBackground` ni `PixelBackground`

#### Scenario: Barrel export funciona para conveniencia
- **WHEN** un consumer importa desde el root del paquete
- **THEN** SHALL tener acceso a todos los componentes exportados por el paquete

### Requirement: Package genera outputs ESM y CJS
El build SHALL producir tanto formato ESM como CJS para máxima compatibilidad con distintos entornos.

#### Scenario: Compatibilidad con bundlers modernos (ESM)
- **WHEN** un proyecto Next.js o Vite importa el paquete
- **THEN** el bundler SHALL resolver la versión ESM con tree-shaking habilitado

#### Scenario: Compatibilidad con entornos CJS
- **WHEN** un script Node.js o un bundler legacy requiere el paquete con `require()`
- **THEN** SHALL resolver la versión CJS sin errores

### Requirement: El paquete es usable desde proyectos JavaScript y TypeScript
El paquete SHALL publicar JavaScript compilado (`dist/*.js`) como output primario. Los archivos `.d.ts` son metadata adicional que los proyectos TypeScript usan automáticamente y los proyectos JavaScript ignoran. Un consumer NO SHALL necesitar TypeScript para usar el paquete.

#### Scenario: Uso desde proyecto JavaScript puro
- **WHEN** un proyecto React con JavaScript (sin TypeScript) instala el paquete y lo importa
- **THEN** los componentes SHALL funcionar exactamente igual que en un proyecto TypeScript, sin errores ni configuración adicional

#### Scenario: Autocompletado en editores TypeScript
- **WHEN** un developer usa un componente del paquete en un proyecto TypeScript
- **THEN** SHALL recibir autocompletado de props y tipos en su editor sin instalar paquetes adicionales

### Requirement: Los ejemplos copy-paste son convertibles a JSX sin fricción
Los archivos `.tsx` en `/examples` SHALL usar TypeScript mínimo: sin interfaces elaboradas, sin genéricos complejos, sin utility types. Las únicas anotaciones de tipo presentes SHALL ser removibles con un find-replace de `: TipoSimple` y un rename de `.tsx` a `.jsx`.

#### Scenario: Developer JS convierte un ejemplo a JSX
- **WHEN** un developer JS copia `examples/aurora-hero.tsx`, renombra a `.jsx`, y remueve las anotaciones de tipo inline (e.g., `: string`, `: number`)
- **THEN** el archivo SHALL funcionar como JSX válido sin ningún otro cambio

### Requirement: React es peer dependency, no dependency
React y React DOM SHALL ser declarados como `peerDependencies` en el `package.json`.

#### Scenario: Sin duplicación de React en el bundle
- **WHEN** un consumer instala `@fethabo/animated-ui` en un proyecto que ya tiene React
- **THEN** el package manager SHALL usar la versión de React del proyecto, no instalar una segunda copia

### Requirement: El paquete no tiene runtime dependencies
El `package.json` SHALL tener el campo `dependencies` vacío o ausente. Todo lo que el paquete necesita para funcionar SHALL ser código propio o APIs nativas del browser/React.

#### Scenario: Instalación limpia sin dependencias transitivas
- **WHEN** un consumer ejecuta `npm install @fethabo/animated-ui`
- **THEN** el package manager SHALL instalar solo el paquete en sí, sin ninguna dependencia transitiva de runtime

### Requirement: Ejemplos copy-paste están disponibles en `/examples`
El repositorio SHALL incluir archivos de ejemplo auto-contenidos que demuestren cada componente con estilos propios, listos para copiar a cualquier proyecto. Los ejemplos se escriben en `.tsx` pero están diseñados para ser fácilmente convertibles a `.jsx`.

#### Scenario: Un ejemplo funciona sin importar del paquete
- **WHEN** un developer copia el archivo `examples/aurora-hero.tsx` a su proyecto
- **THEN** el archivo SHALL funcionar con solo instalar React, sin requerir `@fethabo/animated-ui`

#### Scenario: Los ejemplos muestran customización real
- **WHEN** un developer lee el código de ejemplo
- **THEN** SHALL ver cómo usar CSS custom properties, className, y props para personalizar el componente
