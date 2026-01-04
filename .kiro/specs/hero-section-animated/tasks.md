# Plan de Implementación

- [x] 1. Configurar estructura base y tipos
- [x] 1.1 Crear carpeta de componente HeroSection con estructura de archivos
  - Crear `components/HeroSection/index.tsx`
  - Crear `components/HeroSection/types.ts`
  - Crear `components/HeroSection/constants.ts`
  - _Requisitos: 1.1, 2.1_

- [x] 1.2 Definir interfaces TypeScript para plataformas y estado de animación
  - Definir `SocialPlatform` interface con todos los campos necesarios
  - Definir `AnimationState` interface para tracking de visibilidad
  - Definir props interfaces para todos los componentes
  - _Requisitos: 2.1, 2.3, 3.1_

- [x] 1.3 Crear configuración de plataformas de redes sociales
  - Definir array `SOCIAL_PLATFORMS` con mínimo 6 plataformas
  - Incluir proporciones de aspecto correctas para cada plataforma
  - Definir posiciones absolutas para cada rectángulo
  - Configurar delays y duraciones de animación
  - _Requisitos: 2.1, 2.3, 3.3_

- [x] 1.4 Crear constantes de configuración de animación
  - Definir `ANIMATION_CONFIG` con duraciones y easing
  - Configurar duración de transición entre 500-800ms
  - Definir duración total del ciclo de animación
  - _Requisitos: 3.2, 3.6_

- [x] 2. Extender sistema de internacionalización
- [x] 2.1 Agregar traducciones para la sección Hero
  - Agregar clave `hero.title` en `public/locales/es.json` con "Selecciona una foto, súbela a todas partes"
  - Agregar clave `hero.title` en `public/locales/en.json` con "Select a photo, upload it everywhere"
  - Agregar claves `hero.platforms.*` para nombres de plataformas en ambos idiomas
  - _Requisitos: 7.2, 7.3, 7.4_

- [x] 2.2 Escribir test de propiedad para traducciones
  - **Property 20: Obtención de traducciones desde archivos JSON**
  - **Valida: Requisitos 7.4**

- [x] 3. Implementar componente HeroTitle
- [x] 3.1 Crear componente HeroTitle con internacionalización
  - Marcar como 'use client' para usar hooks
  - Usar hook `useTranslation` para obtener texto traducido
  - Aplicar clases Tailwind para tipografía responsive (text-3xl sm:text-4xl md:text-5xl lg:text-6xl)
  - Asegurar tamaño mínimo de 32px en móvil y 48px en escritorio
  - Aplicar color de texto de la paleta del proyecto
  - Centrar texto horizontalmente
  - _Requisitos: 1.1, 1.2, 1.3, 7.1_

- [x] 3.2 Escribir test de propiedad para tamaños de fuente responsive
  - **Property 2: Tamaños de fuente responsive**
  - **Valida: Requisitos 1.2**

- [x] 3.3 Escribir test de propiedad para renderizado del título
  - **Property 1: Renderizado del título central**
  - **Valida: Requisitos 1.1, 7.1**

- [x] 4. Implementar componente SocialRectangle
- [x] 4.1 Crear componente SocialRectangle presentacional
  - Crear archivo `components/HeroSection/SocialRectangle.tsx`
  - Marcar como 'use client' para usar hooks
  - Recibir props `platform` y `isVisible`
  - Aplicar posicionamiento absoluto usando estilos inline con `platform.position`
  - Implementar transición de opacidad con duración de `ANIMATION_CONFIG.transitionDuration`
  - Usar colores de la paleta: `border-brand-purple`, `bg-brand-dark/30`
  - Aplicar `rounded-lg` y `backdrop-blur-sm`
  - Agregar `aria-hidden="true"` al contenedor del rectángulo
  - Incluir etiqueta de red social traducida usando `useTranslations` desde `hero.platforms.${platform.id}`
  - Aplicar tamaño de fuente `text-xs` (12px) con `text-white/80` para contraste
  - Posicionar etiqueta con `flex items-end justify-center p-2`
  - _Requisitos: 2.2, 2.5, 3.2, 3.4, 3.5, 5.4, 6.4_

- [x] 4.2 Escribir test de propiedad para proporciones de aspecto
  - **Property 7: Proporciones de aspecto correctas**
  - **Valida: Requisitos 2.3**

- [x] 4.3 Escribir test de propiedad para etiquetas en rectángulos
  - **Property 6: Etiquetas en todos los rectángulos**
  - **Valida: Requisitos 2.2**

- [ ]* 4.4 Escribir test de propiedad para valores de opacidad
  - **Property 12: Valores de opacidad en transiciones**
  - **Valida: Requisitos 3.4, 3.5**

- [ ]* 4.5 Escribir test de propiedad para atributos aria-hidden
  - **Property 19: Atributos aria-hidden en elementos decorativos**
  - **Valida: Requisitos 6.4**

- [x] 5. Implementar componente AnimatedSocialRectangles
- [x] 5.1 Crear estructura base del componente con estado
  - Crear archivo `components/HeroSection/AnimatedSocialRectangles.tsx`
  - Marcar como 'use client' para usar hooks
  - Inicializar estado `AnimationState` con `useState`: `visibleRectangles: new Set()`, `currentStep: 0`, `isAnimating: true`
  - Recibir props `platforms` y `enableAnimation` (opcional, default true)
  - Renderizar contenedor absoluto con `className="absolute inset-0 pointer-events-none"` y `aria-hidden="true"`
  - _Requisitos: 3.1, 6.4_

- [x] 5.2 Implementar detección de prefers-reduced-motion y lógica de animación
  - Usar `useEffect` con `window.matchMedia('(prefers-reduced-motion: reduce)')` para detectar preferencia
  - Si prefers-reduced-motion está activo, mostrar todos los rectángulos sin animación (Set con todos los IDs)
  - Usar `useRef` para guardar preferencia y evitar re-renders innecesarios
  - Crear interval que actualiza estado cada `ANIMATION_CONFIG.cycleDuration / platforms.length` milisegundos
  - Calcular qué rectángulos deben estar visibles en cada paso basado en `currentStep`
  - Actualizar Set de rectángulos visibles: agregar/eliminar IDs según el paso actual
  - Implementar ciclo continuo: cuando `currentStep` llega al final, reiniciar a 0
  - Limpiar interval en cleanup de useEffect
  - _Requisitos: 3.1, 3.3, 3.6, 6.1, 6.2_

- [x] 5.3 Renderizar lista de SocialRectangle components
  - Importar componente `SocialRectangle`
  - Mapear array de `platforms` a componentes `<SocialRectangle />`
  - Pasar prop `platform` con cada plataforma
  - Pasar prop `isVisible` basado en `animationState.visibleRectangles.has(platform.id)`
  - Usar `platform.id` como key de React
  - _Requisitos: 2.1, 3.1_

- [ ]* 5.4 Escribir test de propiedad para inicio automático de animación
  - **Property 9: Inicio automático de animación**
  - **Valida: Requisitos 3.1**

- [ ]* 5.5 Escribir test de propiedad para orden secuencial
  - **Property 11: Orden secuencial de animación**
  - **Valida: Requisitos 3.3**

- [ ]* 5.6 Escribir test de propiedad para loop continuo
  - **Property 13: Loop continuo de animación**
  - **Valida: Requisitos 3.6**

- [ ]* 5.7 Escribir test de propiedad para prefers-reduced-motion
  - **Property 17: Respeto a prefers-reduced-motion**
  - **Valida: Requisitos 6.1, 6.2**

- [x] 6. Integrar AnimatedSocialRectangles en HeroSection
- [x] 6.1 Actualizar componente HeroSection para incluir AnimatedSocialRectangles
  - Importar `AnimatedSocialRectangles` y `SOCIAL_PLATFORMS` en `components/HeroSection/index.tsx`
  - Renderizar `<AnimatedSocialRectangles platforms={SOCIAL_PLATFORMS} />` después del div del título
  - Verificar que el título mantiene `z-10` para estar sobre los rectángulos
  - Asegurar que rectángulos no obstruyen legibilidad del título
  - _Requisitos: 1.1, 2.4_

- [ ]* 6.2 Escribir test de propiedad para dimensiones mínimas
  - **Property 4: Dimensiones mínimas del contenedor**
  - **Valida: Requisitos 1.4**

- [ ]* 6.3 Escribir test de propiedad para no obstrucción del título
  - **Property 8: No obstrucción del título**
  - **Valida: Requisitos 2.4**

- [x] 7. Ajustar responsive design para móvil
- [x] 7.1 Optimizar configuración de plataformas para móvil
  - Revisar `SOCIAL_PLATFORMS` en `constants.ts`
  - Considerar reducir tamaños de rectángulos usando clases responsive o media queries
  - Ajustar posiciones para evitar saturación visual en pantallas pequeñas
  - Evaluar mostrar menos rectángulos simultáneamente en móvil (ajustar lógica de animación)
  - _Requisitos: 4.1, 4.2_

- [x] 7.2 Verificar clases responsive en todos los componentes
  - Revisar que HeroSection usa breakpoints de Tailwind (`sm:`, `md:`, `lg:`)
  - Asegurar espaciado responsive con múltiplos de 4px
  - Verificar que elementos permanecen en viewport en todos los tamaños
  - _Requisitos: 4.3, 4.4, 5.5_

- [ ]* 7.3 Escribir test de propiedad para adaptación responsive
  - **Property 14: Adaptación responsive de rectángulos**
  - **Valida: Requisitos 4.1, 4.2, 4.3**

- [ ]* 7.4 Escribir test de propiedad para reposicionamiento en orientación
  - **Property 15: Reposicionamiento en cambio de orientación**
  - **Valida: Requisitos 4.4**

- [ ]* 7.5 Escribir test de propiedad para espaciado en múltiplos de 4
  - **Property 16: Espaciado en múltiplos de 4**
  - **Valida: Requisitos 5.5**

- [x] 8. Validaciones de accesibilidad, diseño y rendimiento
- [x] 8.1 Verificar contraste de colores WCAG AA
  - Asegurar ratio mínimo 4.5:1 entre texto del título y fondo `bg-brand-bg`
  - Verificar contraste de etiquetas de rectángulos (`text-white/80` sobre `bg-brand-dark/30`)
  - Ajustar colores si es necesario para cumplir WCAG AA
  - _Requisitos: 6.3_

- [x] 8.2 Optimizar animaciones para rendimiento
  - Verificar que solo se usan `transform` y `opacity` en animaciones
  - Confirmar que no se animan `width`, `height`, `top`, `left`
  - Considerar agregar `will-change: opacity` si es apropiado
  - _Requisitos: 8.1, 8.2_

- [x] 8.3 Verificar inicialización post-renderizado
  - Confirmar que `useEffect` inicia animaciones después del mount
  - Asegurar que contenido crítico (título) se renderiza primero
  - _Requisitos: 8.4_

- [ ]* 8.4 Escribir test de propiedad para uso de paleta de colores
  - **Property 3: Uso exclusivo de paleta de colores**
  - **Valida: Requisitos 1.3, 5.1, 2.5**

- [ ]* 8.5 Escribir test de propiedad para contraste WCAG AA
  - **Property 18: Contraste WCAG AA**
  - **Valida: Requisitos 6.3**

- [ ]* 8.6 Escribir test de propiedad para propiedades CSS con aceleración
  - **Property 21: Uso de propiedades CSS con aceleración por hardware**
  - **Valida: Requisitos 8.1, 8.2**

- [ ]* 8.7 Escribir test de propiedad para inicialización post-renderizado
  - **Property 22: Inicialización post-renderizado**
  - **Valida: Requisitos 8.4**

- [x] 9. Integrar HeroSection en la página principal
- [x] 9.1 Importar y renderizar HeroSection en app/page.tsx
  - Importar componente `HeroSection` desde `@/components/HeroSection`
  - Posicionar `<HeroSection />` arriba del componente `ImageUploader` existente
  - Ajustar estructura de layout si es necesario (remover título duplicado de app/page.tsx)
  - Verificar que no hay conflictos de estilos
  - Asegurar transición visual fluida entre secciones
  - _Requisitos: 1.1_

- [ ]* 9.2 Escribir test de propiedad para número mínimo de rectángulos
  - **Property 5: Número mínimo de rectángulos**
  - **Valida: Requisitos 2.1**

- [ ]* 9.3 Escribir test de propiedad para duración de transiciones
  - **Property 10: Duración de transiciones de opacidad**
  - **Valida: Requisitos 3.2**

- [ ] 10. Checkpoint final - Verificar que todos los tests pasan
  - Ejecutar `npm test` para correr todos los tests
  - Asegurar que todos los tests pasan
  - Preguntar al usuario si surgen dudas o errores
