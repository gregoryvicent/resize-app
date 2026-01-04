# Documento de Diseño

## Visión General

Este diseño describe la implementación de un selector de idioma (Language Selector) en el componente Header de la aplicación Resize Images. El selector reemplazará el botón "Comenzar" existente y permitirá a los usuarios alternar entre español e inglés mediante un menú desplegable. La implementación aprovechará el sistema de i18n existente y seguirá los patrones de diseño establecidos en la aplicación.

## Arquitectura

### Estructura de Componentes

```
Header (Client Component)
├── Logo/Brand
├── Navigation (Desktop)
├── LanguageSelector (Nuevo)
│   ├── LanguageSelectorButton
│   └── LanguageDropdownMenu
│       ├── LanguageOption (Español)
│       └── LanguageOption (English)
└── MobileMenuButton
```

### Flujo de Datos

1. El componente `Header` se convierte en Client Component usando `'use client'`
2. `Header` usa el hook `useTranslations()` para obtener:
   - `locale`: idioma actual
   - `translations`: objeto de traducciones
   - `setLocale`: función para cambiar idioma
   - `isLoading`: estado de carga
3. `Header` pasa `locale` y `setLocale` al componente `LanguageSelector`
4. `LanguageSelector` maneja el estado local del menú desplegable (abierto/cerrado)
5. Cuando el usuario selecciona un idioma, `LanguageSelector` llama a `setLocale(newLocale)`
6. El hook `useTranslations` carga las nuevas traducciones y actualiza el contexto
7. Todos los componentes que usan `useTranslations` se re-renderizan con las nuevas traducciones

### Integración con Sistema i18n Existente

El diseño aprovecha completamente el sistema i18n existente en `lib/i18n.ts`:
- No se modifica la lógica del hook `useTranslations`
- Se usa `setLocale` para cambiar el idioma
- Se mantiene la estructura de archivos JSON existente
- Se agregan nuevas claves de traducción para el Header

## Componentes e Interfaces

### LanguageSelector Component

**Ubicación:** `components/LanguageSelector/index.tsx`

**Props:**
```typescript
interface LanguageSelectorProps {
  currentLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
}
```

**Estado Local:**
```typescript
const [isOpen, setIsOpen] = useState<boolean>(false);
```

**Funcionalidad:**
- Renderiza un botón que muestra el idioma actual
- Maneja el estado de apertura/cierre del menú desplegable
- Cierra el menú cuando se hace clic fuera (usando useEffect con event listener)
- Cierra el menú cuando se presiona Escape
- Llama a `onLocaleChange` cuando se selecciona un idioma

### LanguageSelectorButton Component

**Ubicación:** `components/LanguageSelector/LanguageSelectorButton.tsx`

**Props:**
```typescript
interface LanguageSelectorButtonProps {
  currentLocale: SupportedLocale;
  isOpen: boolean;
  onClick: () => void;
}
```

**Funcionalidad:**
- Muestra el nombre del idioma actual ("Español" o "English")
- Muestra un icono de globo o chevron
- Aplica estilos hover y focus
- Establece atributos ARIA apropiados

### LanguageDropdownMenu Component

**Ubicación:** `components/LanguageSelector/LanguageDropdownMenu.tsx`

**Props:**
```typescript
interface LanguageDropdownMenuProps {
  isOpen: boolean;
  currentLocale: SupportedLocale;
  onSelectLocale: (locale: SupportedLocale) => void;
}
```

**Funcionalidad:**
- Renderiza condicionalmente basado en `isOpen`
- Muestra opciones para "Español" e "English"
- Marca visualmente la opción actualmente seleccionada
- Maneja clicks en las opciones

### Header Component (Modificado)

**Cambios:**
- Agregar `'use client'` al inicio del archivo
- Importar y usar `useTranslations` hook
- Reemplazar botón "Comenzar" con `<LanguageSelector />`
- Usar traducciones para los enlaces de navegación
- Manejar estado de carga mientras se cargan traducciones

## Modelos de Datos

### Traducciones Agregadas a JSON

**Estructura a agregar en `es.json` y `en.json`:**

```json
{
  "header": {
    "brand": "ResizeImages",
    "nav": {
      "home": "Inicio" | "Home",
      "templates": "Templates",
      "about": "Acerca de" | "About"
    },
    "language": {
      "selector": "Idioma" | "Language",
      "spanish": "Español",
      "english": "English"
    }
  }
}
```

### Tipos TypeScript

```typescript
// Agregar a lib/i18n.ts en la interfaz Translations
export interface Translations {
  // ... campos existentes
  header: {
    brand: string;
    nav: {
      home: string;
      templates: string;
      about: string;
    };
    language: {
      selector: string;
      spanish: string;
      english: string;
    };
  };
}
```

## Correctness Properties

*Una propiedad (property) es una característica o comportamiento que debe mantenerse verdadero en todas las ejecuciones válidas de un sistema - esencialmente, una declaración formal sobre lo que el sistema debe hacer. Las propiedades sirven como puente entre las especificaciones legibles por humanos y las garantías de corrección verificables por máquinas.*


### Reflexión sobre Propiedades

Después de analizar todos los criterios de aceptación, he identificado las siguientes propiedades redundantes o combinables:

- **Criterios 3.4 y 3.5** pueden combinarse en una sola propiedad: "aria-expanded refleja el estado del menú"
- **Criterios 4.1, 4.2 y 4.3** pueden combinarse en una sola propiedad: "cambio de idioma actualiza todas las traducciones"
- Los criterios de diseño visual (2.1-2.5, 5.1, 5.3) son mejor validados mediante ejemplos específicos en lugar de propiedades universales
- Los criterios de implementación (6.1, 6.3, 6.4, 6.5) son verificaciones puntuales, no propiedades universales

### Propiedades Identificadas

**Property 1: Cambio de idioma invoca setLocale**
*Para cualquier* idioma seleccionado del menú desplegable, el sistema debe llamar a la función setLocale con el locale correspondiente
**Validates: Requirements 1.3, 6.2**

**Property 2: Selección cierra el menú**
*Para cualquier* idioma seleccionado, el menú desplegable debe cerrarse automáticamente después de la selección
**Validates: Requirements 1.4**

**Property 3: Texto del selector refleja idioma actual**
*Para cualquier* idioma activo (locale), el texto mostrado en el botón del selector debe corresponder al nombre de ese idioma
**Validates: Requirements 1.5**

**Property 4: aria-expanded refleja estado del menú**
*Para cualquier* estado del menú (abierto o cerrado), el atributo aria-expanded del botón debe ser "true" cuando está abierto y "false" cuando está cerrado
**Validates: Requirements 3.4, 3.5**

**Property 5: Cambio de idioma actualiza todas las traducciones**
*Para cualquier* cambio de idioma, todas las secciones de la aplicación (Header, HeroSection, ImageUploader) deben mostrar las traducciones del nuevo idioma
**Validates: Requirements 4.1, 4.2, 4.3**

**Property 6: Cambio de idioma carga archivo JSON correcto**
*Para cualquier* idioma seleccionado, el sistema debe cargar el archivo de traducciones correspondiente (es.json para español, en.json para inglés)
**Validates: Requirements 4.4**

## Manejo de Errores

### Errores de Carga de Traducciones

**Escenario:** El archivo JSON de traducciones no se puede cargar

**Manejo:**
- El hook `useTranslations` ya tiene un fallback a inglés implementado
- Si incluso el inglés falla, usa traducciones hardcodeadas por defecto
- Se registra el error en la consola para debugging
- La UI no se rompe, muestra traducciones por defecto

### Errores de Estado

**Escenario:** El estado del menú desplegable se desincroniza

**Manejo:**
- Usar event listeners para cerrar el menú al hacer clic fuera
- Cerrar el menú al presionar Escape
- Cerrar el menú automáticamente después de seleccionar un idioma
- Limpiar event listeners en el cleanup de useEffect

### Errores de Accesibilidad

**Escenario:** Los atributos ARIA no se actualizan correctamente

**Manejo:**
- Vincular aria-expanded directamente al estado `isOpen`
- Usar aria-label descriptivos en todos los elementos interactivos
- Asegurar que el foco del teclado es visible con estilos focus

## Estrategia de Testing

### Unit Tests

Los unit tests verificarán casos específicos y comportamientos de UI:

1. **Renderizado del LanguageSelector:**
   - Verifica que el selector se renderiza con el idioma actual
   - Verifica que el menú está cerrado por defecto
   - Verifica que las clases CSS correctas están aplicadas

2. **Interacción con el menú:**
   - Verifica que hacer clic abre el menú
   - Verifica que el menú muestra ambas opciones de idioma
   - Verifica que hacer clic en una opción llama a onLocaleChange

3. **Accesibilidad:**
   - Verifica que aria-expanded está presente
   - Verifica que aria-label está presente
   - Verifica que las clases focus están aplicadas

4. **Header con traducciones:**
   - Verifica que el Header usa useTranslations
   - Verifica que los enlaces de navegación usan las traducciones
   - Verifica que el Header es un Client Component

### Property-Based Tests

Los property tests verificarán propiedades universales usando la librería **fast-check** (para TypeScript/React):

**Configuración:**
- Librería: fast-check
- Iteraciones mínimas: 100 por propiedad
- Cada test debe referenciar explícitamente la propiedad del diseño

**Property Tests a implementar:**

1. **Property Test: Cambio de idioma invoca setLocale**
   - Generar: locale aleatorio ('es' o 'en')
   - Verificar: que setLocale se llama con ese locale
   - **Feature: language-selector-header, Property 1: Cambio de idioma invoca setLocale**

2. **Property Test: Selección cierra el menú**
   - Generar: locale aleatorio
   - Verificar: que después de seleccionar, isOpen es false
   - **Feature: language-selector-header, Property 2: Selección cierra el menú**

3. **Property Test: Texto del selector refleja idioma actual**
   - Generar: locale aleatorio
   - Verificar: que el texto mostrado corresponde al idioma (es → "Español", en → "English")
   - **Feature: language-selector-header, Property 3: Texto del selector refleja idioma actual**

4. **Property Test: aria-expanded refleja estado del menú**
   - Generar: estado booleano aleatorio (true/false)
   - Verificar: que aria-expanded coincide con el estado
   - **Feature: language-selector-header, Property 4: aria-expanded refleja estado del menú**

5. **Property Test: Cambio de idioma actualiza todas las traducciones**
   - Generar: locale aleatorio
   - Verificar: que todas las secciones usan las traducciones del nuevo locale
   - **Feature: language-selector-header, Property 5: Cambio de idioma actualiza todas las traducciones**

6. **Property Test: Cambio de idioma carga archivo JSON correcto**
   - Generar: locale aleatorio
   - Verificar: que loadTranslations se llama con el locale correcto
   - **Feature: language-selector-header, Property 6: Cambio de idioma carga archivo JSON correcto**

### Integration Tests

Los integration tests verificarán el flujo completo:

1. **Flujo de cambio de idioma:**
   - Usuario abre el selector
   - Usuario selecciona un idioma
   - Todas las traducciones se actualizan
   - El menú se cierra

2. **Persistencia de idioma:**
   - Usuario cambia el idioma
   - Usuario navega a otra sección
   - El idioma seleccionado se mantiene

## Consideraciones de Implementación

### Performance

- El componente LanguageSelector es ligero y no requiere optimización especial
- Las traducciones se cargan una sola vez por cambio de idioma
- No usar React.memo a menos que se detecten problemas de re-renderizado

### Accesibilidad

- Todos los elementos interactivos deben ser accesibles por teclado
- Los estados focus deben ser claramente visibles
- Los atributos ARIA deben estar presentes y actualizados
- El contraste de colores debe cumplir WCAG AA

### Responsive Design

- El selector debe funcionar en todos los tamaños de pantalla
- En móvil, el selector debe tener tamaño táctil mínimo de 44x44px
- El menú desplegable debe posicionarse apropiadamente en todas las pantallas

### Mantenibilidad

- Separar el LanguageSelector en su propia carpeta de componente
- Usar tipos TypeScript estrictos
- Documentar las props y funcionalidad con comentarios
- Seguir los patrones de código existentes en la aplicación
