# Documento de Diseño

## Visión General

La sección Hero animada es el primer punto de contacto visual del usuario con la aplicación Resize Images. Su propósito es comunicar de manera inmediata y atractiva el valor de la aplicación mediante un título central claro y una representación visual dinámica de las diferentes plataformas de redes sociales soportadas.

El diseño se centra en crear una experiencia visual memorable que combine minimalismo con dinamismo, utilizando animaciones sutiles de rectángulos que representan los diferentes formatos de imagen de redes sociales. La implementación debe ser performante, accesible y completamente responsive.

## Arquitectura

### Estructura de Componentes

```
HeroSection (Server Component)
├── HeroTitle (Client Component)
│   └── Texto traducido del título
└── AnimatedSocialRectangles (Client Component)
    ├── SocialRectangle (x6+)
    │   ├── Rectángulo visual
    │   └── Etiqueta de red social
    └── Lógica de animación
```

### Separación de Responsabilidades

- **HeroSection**: Componente contenedor de servidor que estructura el layout general
- **HeroTitle**: Componente cliente que maneja el título con internacionalización
- **AnimatedSocialRectangles**: Componente cliente que orquesta la secuencia de animación
- **SocialRectangle**: Componente presentacional que renderiza cada rectángulo individual

### Decisión: Server vs Client Components

- **HeroSection** será Server Component para optimizar el renderizado inicial
- **HeroTitle** será Client Component porque necesita acceso a i18n en el cliente
- **AnimatedSocialRectangles** será Client Component porque maneja estado de animación y efectos
- **SocialRectangle** será componente presentacional puro (parte de AnimatedSocialRectangles)

## Componentes e Interfaces

### Tipos de Datos

```typescript
// types.ts
export interface SocialPlatform {
  id: string;
  name: string;
  aspectRatio: number; // width/height
  width: number; // en píxeles base
  height: number; // en píxeles base
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationDelay: number; // en milisegundos
  duration: number; // duración visible en milisegundos
}

export interface AnimationState {
  visibleRectangles: Set<string>;
  currentStep: number;
  isAnimating: boolean;
}

export interface HeroTitleProps {
  className?: string;
}

export interface AnimatedSocialRectanglesProps {
  platforms: SocialPlatform[];
  enableAnimation?: boolean;
}

export interface SocialRectangleProps {
  platform: SocialPlatform;
  isVisible: boolean;
}
```

### Configuración de Plataformas

```typescript
// constants.ts
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    aspectRatio: 1, // 1:1
    width: 120,
    height: 120,
    position: { top: '15%', left: '10%' },
    animationDelay: 0,
    duration: 2000
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    aspectRatio: 0.5625, // 9:16
    width: 80,
    height: 142,
    position: { top: '20%', right: '15%' },
    animationDelay: 500,
    duration: 2000
  },
  {
    id: 'facebook-post',
    name: 'Facebook',
    aspectRatio: 1.91, // 1.91:1
    width: 150,
    height: 78,
    position: { bottom: '25%', left: '8%' },
    animationDelay: 1000,
    duration: 2000
  },
  {
    id: 'twitter-post',
    name: 'Twitter',
    aspectRatio: 1.78, // 16:9
    width: 140,
    height: 78,
    position: { top: '40%', right: '10%' },
    animationDelay: 1500,
    duration: 2000
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn',
    aspectRatio: 1.91,
    width: 130,
    height: 68,
    position: { bottom: '15%', right: '12%' },
    animationDelay: 2000,
    duration: 2000
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube',
    aspectRatio: 1.78,
    width: 160,
    height: 90,
    position: { top: '50%', left: '5%' },
    animationDelay: 2500,
    duration: 2000
  }
];

export const ANIMATION_CONFIG = {
  transitionDuration: 600, // ms
  cycleDuration: 8000, // ms - duración total del ciclo
  easingFunction: 'ease-in-out'
};
```

### HeroSection Component

```typescript
// components/HeroSection/index.tsx
import { HeroTitle } from './HeroTitle';
import { AnimatedSocialRectangles } from './AnimatedSocialRectangles';
import { SOCIAL_PLATFORMS } from './constants';

export function HeroSection() {
  return (
    <section 
      className="relative w-full min-h-[400px] md:min-h-[500px] bg-brand-bg overflow-hidden flex items-center justify-center py-16 md:py-20"
      aria-label="Hero section"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <HeroTitle />
      </div>
      
      <AnimatedSocialRectangles platforms={SOCIAL_PLATFORMS} />
    </section>
  );
}
```

### HeroTitle Component

```typescript
// components/HeroSection/HeroTitle.tsx
'use client';

import { useTranslation } from '@/lib/i18n';

export function HeroTitle({ className = '' }: HeroTitleProps) {
  const { t } = useTranslation();
  
  return (
    <h1 
      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white leading-tight ${className}`}
    >
      {t('hero.title')}
    </h1>
  );
}
```

### AnimatedSocialRectangles Component

```typescript
// components/HeroSection/AnimatedSocialRectangles.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { SocialRectangle } from './SocialRectangle';
import { ANIMATION_CONFIG } from './constants';
import type { AnimatedSocialRectanglesProps, AnimationState } from './types';

export function AnimatedSocialRectangles({ 
  platforms,
  enableAnimation = true 
}: AnimatedSocialRectanglesProps) {
  const [animationState, setAnimationState] = useState<AnimationState>({
    visibleRectangles: new Set(),
    currentStep: 0,
    isAnimating: enableAnimation
  });
  
  const prefersReducedMotion = useRef(false);
  
  useEffect(() => {
    // Detectar preferencia de movimiento reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    
    if (mediaQuery.matches) {
      // Mostrar todos los rectángulos sin animación
      setAnimationState({
        visibleRectangles: new Set(platforms.map(p => p.id)),
        currentStep: 0,
        isAnimating: false
      });
      return;
    }
    
    if (!enableAnimation) return;
    
    // Iniciar secuencia de animación
    const animationInterval = setInterval(() => {
      setAnimationState(prev => {
        const nextStep = (prev.currentStep + 1) % platforms.length;
        const newVisible = new Set(prev.visibleRectangles);
        
        // Determinar qué rectángulos deben estar visibles en este paso
        platforms.forEach((platform, index) => {
          const shouldBeVisible = index <= nextStep;
          if (shouldBeVisible) {
            newVisible.add(platform.id);
          } else {
            newVisible.delete(platform.id);
          }
        });
        
        return {
          ...prev,
          visibleRectangles: newVisible,
          currentStep: nextStep
        };
      });
    }, ANIMATION_CONFIG.cycleDuration / platforms.length);
    
    return () => clearInterval(animationInterval);
  }, [platforms, enableAnimation]);
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {platforms.map(platform => (
        <SocialRectangle
          key={platform.id}
          platform={platform}
          isVisible={animationState.visibleRectangles.has(platform.id)}
        />
      ))}
    </div>
  );
}
```

### SocialRectangle Component

```typescript
// components/HeroSection/SocialRectangle.tsx
'use client';

import { useTranslation } from '@/lib/i18n';
import type { SocialRectangleProps } from './types';
import { ANIMATION_CONFIG } from './constants';

export function SocialRectangle({ platform, isVisible }: SocialRectangleProps) {
  const { t } = useTranslation();
  
  return (
    <div
      className="absolute transition-opacity"
      style={{
        ...platform.position,
        width: `${platform.width}px`,
        height: `${platform.height}px`,
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${ANIMATION_CONFIG.transitionDuration}ms`,
        transitionTimingFunction: ANIMATION_CONFIG.easingFunction,
        transitionDelay: `${platform.animationDelay}ms`
      }}
    >
      <div className="w-full h-full border-2 border-brand-purple bg-brand-dark/30 rounded-lg backdrop-blur-sm flex items-end justify-center p-2">
        <span className="text-xs text-white/80 font-medium">
          {t(`hero.platforms.${platform.id}`)}
        </span>
      </div>
    </div>
  );
}
```

## Modelos de Datos

### Plataformas de Redes Sociales

Las plataformas se definen como objetos inmutables con las siguientes características:

- **Identificador único**: Para tracking en animaciones
- **Nombre**: Para display y traducción
- **Proporción de aspecto**: Basada en las especificaciones reales de cada plataforma
- **Dimensiones**: Tamaños base que se escalan responsivamente
- **Posición**: Coordenadas absolutas relativas al contenedor
- **Timing de animación**: Delay y duración para la secuencia

### Estado de Animación

El estado de animación se maneja mediante:

- **Set de rectángulos visibles**: Estructura de datos eficiente para lookups O(1)
- **Paso actual**: Índice en la secuencia de animación
- **Flag de animación activa**: Para pausar/reanudar

## Propiedades de Corrección

*Una propiedad es una característica o comportamiento que debe mantenerse verdadero en todas las ejecuciones válidas de un sistema - esencialmente, una declaración formal sobre lo que el sistema debe hacer. Las propiedades sirven como puente entre especificaciones legibles por humanos y garantías de corrección verificables por máquina.*


### Reflexión sobre Propiedades

Después de analizar todos los criterios de aceptación, identifico las siguientes redundancias y consolidaciones:

**Redundancias identificadas:**
- Propiedades 3.4 y 3.5 (transiciones de opacidad) pueden consolidarse en una sola propiedad sobre transiciones de opacidad bidireccionales
- Propiedades 1.3 y 5.1 (uso de paleta de colores) son redundantes - 5.1 es más comprehensiva
- Propiedades 5.2 y 5.3 son ejemplos específicos que pueden verificarse con tests unitarios en lugar de propiedades
- Propiedades 6.1 y 6.2 (prefers-reduced-motion) pueden consolidarse en una sola propiedad
- Propiedades 4.1, 4.2 y 4.3 (responsive) pueden consolidarse en una propiedad sobre adaptación responsive

**Propiedades a mantener:**
Las propiedades únicas que proporcionan valor de validación distinto se mantendrán, eliminando las redundantes y consolidando las relacionadas.

### Propiedades de Corrección

Property 1: Renderizado del título central
*Para cualquier* estado de carga de la página, el componente HeroSection debe renderizar un elemento de título con el texto traducido correspondiente al idioma del usuario
**Valida: Requisitos 1.1, 7.1**

Property 2: Tamaños de fuente responsive
*Para cualquier* viewport, el tamaño de fuente del título debe ser mayor o igual a 32px en móvil (< 768px) y mayor o igual a 48px en escritorio (>= 768px)
**Valida: Requisitos 1.2**

Property 3: Uso exclusivo de paleta de colores
*Para cualquier* elemento renderizado en la sección Hero, todos los colores aplicados (texto, fondo, bordes) deben pertenecer al conjunto de colores de la paleta del proyecto: #0A0028, #090040, #B13BFF, #471396, #FFCC00
**Valida: Requisitos 1.3, 5.1, 2.5**

Property 4: Dimensiones mínimas del contenedor
*Para cualquier* viewport, la sección Hero debe tener ancho del 100% del viewport y altura mínima de 400px en móvil (< 768px) o 500px en escritorio (>= 768px)
**Valida: Requisitos 1.4**

Property 5: Número mínimo de rectángulos
*Para cualquier* renderizado de la sección Hero, debe mostrar al menos 6 rectángulos de redes sociales
**Valida: Requisitos 2.1**

Property 6: Etiquetas en todos los rectángulos
*Para cualquier* rectángulo de red social renderizado, debe contener una etiqueta de texto visible que identifique la plataforma
**Valida: Requisitos 2.2**

Property 7: Proporciones de aspecto correctas
*Para cualquier* plataforma de red social definida, la proporción de aspecto (width/height) del rectángulo debe coincidir con la proporción especificada para esa plataforma con una tolerancia de ±0.01
**Valida: Requisitos 2.3**

Property 8: No obstrucción del título
*Para cualquier* rectángulo de red social posicionado, su área de bounding box no debe intersectar con el área del título central (considerando un margen de seguridad)
**Valida: Requisitos 2.4**

Property 9: Inicio automático de animación
*Para cualquier* carga de página donde prefers-reduced-motion no esté activo, el estado de animación debe cambiar de su valor inicial dentro de un tiempo máximo definido
**Valida: Requisitos 3.1**

Property 10: Duración de transiciones de opacidad
*Para cualquier* cambio de visibilidad de un rectángulo, la duración de la transición CSS de opacidad debe estar entre 500ms y 800ms
**Valida: Requisitos 3.2**

Property 11: Orden secuencial de animación
*Para cualquier* ciclo de animación, los rectángulos deben aparecer y desaparecer en el orden definido por sus valores de animationDelay, sin que dos rectángulos tengan el mismo delay
**Valida: Requisitos 3.3**

Property 12: Valores de opacidad en transiciones
*Para cualquier* rectángulo, cuando isVisible es true la opacidad debe ser 1, y cuando isVisible es false la opacidad debe ser 0
**Valida: Requisitos 3.4, 3.5**

Property 13: Loop continuo de animación
*Para cualquier* ciclo de animación completado, el estado debe reiniciarse al paso 0 y continuar la secuencia automáticamente
**Valida: Requisitos 3.6**

Property 14: Adaptación responsive de rectángulos
*Para cualquier* cambio de viewport de desktop a móvil, el número de rectángulos visibles simultáneamente debe reducirse y sus tamaños deben escalar proporcionalmente
**Valida: Requisitos 4.1, 4.2, 4.3**

Property 15: Reposicionamiento en cambio de orientación
*Para cualquier* cambio de orientación del dispositivo, todos los rectángulos deben permanecer dentro de los límites del viewport
**Valida: Requisitos 4.4**

Property 16: Espaciado en múltiplos de 4
*Para cualquier* valor de padding o margin aplicado en la sección Hero, debe ser múltiplo de 4 píxeles
**Valida: Requisitos 5.5**

Property 17: Respeto a prefers-reduced-motion
*Para cualquier* usuario con prefers-reduced-motion activo, todos los rectángulos deben estar visibles simultáneamente y el flag isAnimating debe ser false
**Valida: Requisitos 6.1, 6.2**

Property 18: Contraste WCAG AA
*Para cualquier* combinación de texto y fondo en la sección Hero, la relación de contraste debe ser mayor o igual a 4.5:1
**Valida: Requisitos 6.3**

Property 19: Atributos aria-hidden en elementos decorativos
*Para cualquier* rectángulo de red social renderizado, debe tener el atributo aria-hidden="true"
**Valida: Requisitos 6.4**

Property 20: Obtención de traducciones desde archivos JSON
*Para cualquier* texto mostrado en la sección Hero (título y etiquetas), el contenido debe provenir de los archivos de traducción JSON correspondientes al idioma activo
**Valida: Requisitos 7.4**

Property 21: Uso de propiedades CSS con aceleración por hardware
*Para cualquier* animación aplicada, solo deben usarse las propiedades CSS transform y opacity
**Valida: Requisitos 8.1, 8.2**

Property 22: Inicialización post-renderizado
*Para cualquier* carga de página, las animaciones deben inicializarse solo después de que el contenido crítico (título y estructura) esté completamente renderizado
**Valida: Requisitos 8.4**

## Manejo de Errores

### Escenarios de Error

1. **Fallo en carga de traducciones**
   - Fallback a idioma por defecto (inglés)
   - Log de error en consola de desarrollo
   - Mostrar texto en inglés sin bloquear renderizado

2. **Detección de idioma fallida**
   - Usar inglés como idioma por defecto
   - Permitir override manual si se implementa selector de idioma

3. **Viewport extremadamente pequeño**
   - Reducir número de rectángulos visibles a 3 mínimo
   - Escalar tamaños proporcionalmente
   - Mantener legibilidad del título como prioridad

4. **Navegador sin soporte para CSS moderno**
   - Graceful degradation: mostrar rectángulos estáticos
   - Mantener funcionalidad core (título visible)
   - No bloquear renderizado de la página

### Estrategias de Recuperación

- **Progressive Enhancement**: La sección funciona sin JavaScript (título visible)
- **Fallbacks CSS**: Variables CSS con valores por defecto
- **Error Boundaries**: Envolver componentes cliente en error boundary de React
- **Logging**: Errores no críticos se loguean pero no bloquean UI

## Estrategia de Testing

### Testing Unitario

**Componentes a testear:**

1. **HeroTitle**
   - Renderiza el texto correcto según idioma
   - Aplica clases CSS correctas
   - Maneja cambios de idioma

2. **SocialRectangle**
   - Renderiza con props correctas
   - Aplica estilos de visibilidad correctamente
   - Muestra etiqueta traducida

3. **AnimatedSocialRectangles**
   - Inicializa estado correctamente
   - Detecta prefers-reduced-motion
   - Maneja ciclo de animación

**Herramientas:**
- Vitest para test runner
- React Testing Library para renderizado de componentes
- @testing-library/user-event para interacciones

### Property-Based Testing

**Biblioteca:** fast-check (para TypeScript/JavaScript)

**Configuración:** Mínimo 100 iteraciones por propiedad

**Propiedades a implementar:**

Cada property-based test debe:
- Ejecutarse con mínimo 100 iteraciones
- Incluir comentario con formato: `**Feature: hero-section-animated, Property {número}: {texto}**`
- Generar datos de entrada aleatorios pero válidos
- Verificar la propiedad universal

**Generadores necesarios:**

```typescript
// Generador de viewports
const viewportGenerator = fc.record({
  width: fc.integer({ min: 320, max: 2560 }),
  height: fc.integer({ min: 568, max: 1440 })
});

// Generador de plataformas
const platformGenerator = fc.record({
  id: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  aspectRatio: fc.float({ min: 0.5, max: 2.0 }),
  width: fc.integer({ min: 50, max: 200 }),
  height: fc.integer({ min: 50, max: 200 }),
  position: fc.record({
    top: fc.option(fc.string()),
    bottom: fc.option(fc.string()),
    left: fc.option(fc.string()),
    right: fc.option(fc.string())
  }),
  animationDelay: fc.integer({ min: 0, max: 5000 }),
  duration: fc.integer({ min: 1000, max: 3000 })
});

// Generador de colores de paleta
const paletteColorGenerator = fc.constantFrom(
  '#0A0028', '#090040', '#B13BFF', '#471396', '#FFCC00'
);

// Generador de idiomas
const languageGenerator = fc.constantFrom('en', 'es');
```

**Tests de integración:**

- Renderizado completo de HeroSection
- Interacción entre componentes
- Ciclo completo de animación
- Cambios de viewport

### Cobertura de Testing

**Objetivo:** 80% de cobertura de código mínimo

**Prioridades:**
1. Lógica de animación (crítica)
2. Detección de prefers-reduced-motion (accesibilidad)
3. Cálculos de responsive (UX)
4. Internacionalización (funcionalidad core)

## Consideraciones de Rendimiento

### Optimizaciones

1. **Animaciones CSS puras**
   - Usar solo transform y opacity
   - Aprovechar aceleración por hardware
   - Evitar reflows y repaints

2. **Memoización**
   - Memoizar SocialRectangle con React.memo
   - useMemo para cálculos de posiciones
   - useCallback para handlers de animación

3. **Lazy Loading**
   - Componente Hero puede ser prioritario (above the fold)
   - Considerar preload de traducciones críticas

4. **Bundle Size**
   - Tree-shaking de utilidades no usadas
   - Importaciones específicas de librerías

### Métricas de Rendimiento

- **FCP (First Contentful Paint)**: < 1.5s
- **LCP (Largest Contentful Paint)**: < 2.5s (título debe ser visible rápido)
- **CLS (Cumulative Layout Shift)**: < 0.1 (sin shifts por animaciones)
- **FPS durante animaciones**: > 30 FPS mínimo, objetivo 60 FPS

## Internacionalización

### Estructura de Archivos de Traducción

```json
// public/locales/es.json
{
  "hero": {
    "title": "Selecciona una foto, súbela a todas partes",
    "platforms": {
      "instagram-post": "Instagram Post",
      "instagram-story": "Instagram Story",
      "facebook-post": "Facebook",
      "twitter-post": "Twitter",
      "linkedin-post": "LinkedIn",
      "youtube-thumbnail": "YouTube"
    }
  }
}

// public/locales/en.json
{
  "hero": {
    "title": "Select a photo, upload it everywhere",
    "platforms": {
      "instagram-post": "Instagram Post",
      "instagram-story": "Instagram Story",
      "facebook-post": "Facebook",
      "twitter-post": "Twitter",
      "linkedin-post": "LinkedIn",
      "youtube-thumbnail": "YouTube"
    }
  }
}
```

### Detección de Idioma

```typescript
// lib/i18n.ts - extensión
export function detectLanguage(): 'en' | 'es' {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
}
```

## Decisiones de Diseño

### ¿Por qué animaciones CSS en lugar de JavaScript?

- **Rendimiento**: CSS animations aprovechan aceleración por hardware
- **Simplicidad**: Menos código, más declarativo
- **Accesibilidad**: Más fácil respetar prefers-reduced-motion
- **Mantenibilidad**: Separación de concerns (estilos vs lógica)

### ¿Por qué posicionamiento absoluto?

- **Flexibilidad**: Control preciso de posiciones
- **Animaciones**: No afecta el layout de otros elementos
- **Responsive**: Fácil ajustar posiciones por viewport
- **Rendimiento**: No causa reflows en elementos hermanos

### ¿Por qué Set para tracking de visibilidad?

- **Eficiencia**: Lookups O(1) vs arrays O(n)
- **Semántica**: Set representa mejor "conjunto de IDs únicos"
- **Inmutabilidad**: Fácil crear nuevos Sets en actualizaciones de estado

### ¿Por qué separar HeroTitle de AnimatedSocialRectangles?

- **Responsabilidad única**: Cada componente tiene un propósito claro
- **Reusabilidad**: Título podría usarse sin animaciones
- **Testing**: Más fácil testear componentes aislados
- **Rendimiento**: Memoización más efectiva con componentes pequeños

## Extensibilidad Futura

### Posibles Mejoras

1. **Más plataformas**: Agregar TikTok, Pinterest, Snapchat
2. **Animaciones personalizables**: Permitir diferentes patrones de animación
3. **Interactividad**: Hover sobre rectángulos muestra info de la plataforma
4. **Temas**: Soporte para modo claro/oscuro
5. **A/B Testing**: Diferentes variantes de animación

### Puntos de Extensión

- Array de plataformas es configurable
- Configuración de animación centralizada en constantes
- Componente SocialRectangle puede extenderse con más props
- Sistema de traducción soporta agregar más idiomas fácilmente
