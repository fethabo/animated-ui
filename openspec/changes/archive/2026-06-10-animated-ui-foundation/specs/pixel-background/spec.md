## ADDED Requirements

### Requirement: PixelBackground renderiza una grilla de píxeles sobre un canvas
El componente SHALL renderizar un elemento `<canvas>` que cubre su contenedor, dibujando una grilla de celdas rectangulares con gap configurable. El canvas SHALL redibujarse con `requestAnimationFrame` mientras hay behaviors activos.

#### Scenario: Canvas cubre el contenedor
- **WHEN** el componente se renderiza dentro de un div de 800×400px
- **THEN** el canvas SHALL tener exactamente esas dimensiones y cubrir el área completamente

#### Scenario: Resize del contenedor
- **WHEN** el contenedor cambia de tamaño (e.g., responsive resize)
- **THEN** el canvas SHALL redimensionarse y recalcular la grilla automáticamente

### Requirement: El tamaño de celda y gap son configurables
El componente SHALL aceptar props `cellSize` (tamaño en píxeles de cada celda) y `gap` (espacio entre celdas). Ambos SHALL tener valores default razonables.

#### Scenario: Celdas pequeñas para efecto denso
- **WHEN** el consumer pasa `cellSize={4} gap={1}`
- **THEN** la grilla SHALL mostrar celdas de 4×4px separadas por 1px, resultando en una textura densa

#### Scenario: Celdas grandes para efecto retro
- **WHEN** el consumer pasa `cellSize={20} gap={3}`
- **THEN** la grilla SHALL mostrar celdas grandes con espacio visible entre ellas

### Requirement: El behavior `hover` ilumina celdas según su proximidad al mouse
Cuando `behaviors` incluye `'hover'`, el componente SHALL calcular la distancia de cada celda al cursor y aumentar su brillo proporcionalmente, creando un efecto de luz que sigue al mouse.

#### Scenario: Iluminación radial al mover el mouse
- **WHEN** el usuario mueve el mouse sobre el canvas
- **THEN** las celdas más cercanas al cursor SHALL aparecer más brillantes, con una caída gradual hacia los bordes del radio de influencia

#### Scenario: Sin iluminación fuera del canvas
- **WHEN** el cursor sale del área del canvas
- **THEN** las celdas SHALL volver gradualmente a su estado base sin iluminación

#### Scenario: Radio de influencia configurable
- **WHEN** el consumer pasa `hoverRadius={200}`
- **THEN** el efecto de iluminación SHALL afectar celdas dentro de un radio de 200px del cursor

### Requirement: El behavior `idle` produce una animación autónoma de parpadeo
Cuando `behaviors` incluye `'idle'`, las celdas SHALL parpadear de forma independiente y asíncrona simulando actividad, como estrellas o ruido vivo.

#### Scenario: Celdas parpadean sin interacción del usuario
- **WHEN** el componente está montado con behavior `idle` y el usuario no interactúa
- **THEN** SHALL haber celdas que aumentan y disminuyen su brillo de forma continua y asíncrona

#### Scenario: Intensidad del idle configurable
- **WHEN** el consumer pasa `idleIntensity={0.2}`
- **THEN** el parpadeo autónomo SHALL ser más sutil que el valor default de 1.0

### Requirement: El behavior `reveal` muestra las celdas progresivamente con dithering
Cuando `behaviors` incluye `'reveal'`, al montar el componente las celdas SHALL aparecer progresivamente usando un patrón de dithering ordenado (matriz Bayer), creando un efecto de "materialización pixelada".

#### Scenario: Reveal al montar el componente
- **WHEN** el componente monta con behavior `reveal`
- **THEN** las celdas SHALL comenzar invisibles y aparecer progresivamente hasta que toda la grilla es visible

#### Scenario: Duración del reveal configurable
- **WHEN** el consumer pasa `revealDuration={800}`
- **THEN** el reveal SHALL completarse en aproximadamente 800ms

#### Scenario: Pattern de dithering Bayer visible durante el reveal
- **WHEN** el reveal está en curso al 50% de progreso
- **THEN** las celdas visibles SHALL seguir el patrón de dithering ordenado, no una secuencia aleatoria ni un wipe lineal

### Requirement: Los tres behaviors son combinables
El componente SHALL soportar cualquier combinación de behaviors en el array `behaviors`, aplicando las contribuciones de cada behavior aditivamente en cada frame.

#### Scenario: Hover + idle simultáneos
- **WHEN** el consumer pasa `behaviors={['hover', 'idle']}`
- **THEN** las celdas SHALL responder al mouse Y parpadear autónomamente al mismo tiempo

#### Scenario: Los tres behaviors activos
- **WHEN** el consumer pasa `behaviors={['hover', 'idle', 'reveal']}`
- **THEN** el reveal SHALL ocurrir al montar, luego las celdas SHALL parpadear y responder al mouse

### Requirement: El color de las celdas es configurable via prop simple o función callback
El componente SHALL aceptar tanto un color estático `color` como una función `cellColor(x, y, proximity, idlePhase)` para theming avanzado.

#### Scenario: Color simple para todos los píxeles
- **WHEN** el consumer pasa `color="#7c3aed"`
- **THEN** todas las celdas SHALL usar ese color con distintas opacidades según su estado

#### Scenario: Color dinámico por posición
- **WHEN** el consumer pasa `cellColor={(x, y) => \`hsl(\${(x / cols) * 360}, 70%, 60%)\`}`
- **THEN** las celdas SHALL mostrar un gradiente de colores basado en su posición en la grilla

### Requirement: PixelBackground respeta prefers-reduced-motion
Cuando la preferencia está activa, el componente SHALL mostrar la grilla estática sin animaciones de idle ni reveal. El behavior hover SHALL seguir funcionando (es respuesta directa a input del usuario).

#### Scenario: Grilla estática con reduced motion
- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el behavior `idle` está activo
- **THEN** el parpadeo autónomo SHALL detenerse, mostrando la grilla en estado base
