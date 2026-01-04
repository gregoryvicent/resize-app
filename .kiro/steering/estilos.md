---
inclusion: always
---

# Guía de Diseño y Estilos

## Filosofía de Diseño
- **Minimalista**: Interfaces limpias sin elementos innecesarios
- **Intuitivo**: Flujos claros sin necesidad de instrucciones
- **Mobile First**: Diseñar primero para móvil, luego escalar a desktop
- **Público objetivo**: Creadores de contenido jóvenes que necesitan herramientas rápidas para redes sociales

## Paleta de Colores (Uso Obligatorio)

SIEMPRE usar estos colores exactos para mantener consistencia de marca:

```
#0A0028  (brand-bg)        → Background general de la página
#090040  (brand-dark)      → Fondos oscuros, texto principal en modo claro
#B13BFF  (brand-purple)    → Botones primarios, CTAs, elementos interactivos
#471396  (brand-secondary) → Estados hover, bordes, elementos secundarios
#FFCC00  (brand-accent)    → Highlights, notificaciones, énfasis
```

### Aplicación de Colores
- Background general: `bg-brand-bg`
- Botones primarios: `bg-brand-purple hover:bg-brand-secondary`
- Botones secundarios: `border-brand-purple text-brand-purple hover:bg-brand-purple/10`
- Fondos oscuros: `bg-brand-dark`
- Acentos/alertas: `text-brand-accent` o `bg-brand-accent`

## Tailwind CSS - Reglas de Implementación

### Clases de Color Personalizadas
Configurar en `tailwind.config` (si no existe, agregarlo):
```javascript
colors: {
  'brand-bg': '#0A0028',
  'brand-dark': '#090040',
  'brand-purple': '#B13BFF',
  'brand-secondary': '#471396',
  'brand-accent': '#FFCC00',
}
```

### Responsive Design
- Usar breakpoints estándar: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Escribir clases mobile-first: base sin prefijo, luego agregar `md:`, `lg:` para pantallas mayores
- Elementos táctiles mínimo 44x44px: usar `min-h-11 min-w-11` o equivalente

### Espaciado y Layout
- Usar escala de Tailwind (4px base): `p-4`, `m-6`, `gap-3`, etc.
- Preferir `gap` sobre margins en contenedores flex/grid
- Mantener consistencia: si un componente usa `p-4`, componentes similares también

### Transiciones y Animaciones
- Transiciones estándar: `transition-all duration-200 ease-in-out`
- Hover states: siempre incluir feedback visual con `hover:`
- Focus states: `focus:ring-2 focus:ring-brand-purple focus:outline-none`
- Evitar animaciones largas o distractoras

## Componentes UI - Patrones Específicos

### Botones
```tsx
// Primario
className="bg-brand-purple hover:bg-brand-secondary text-white px-6 py-3 rounded-lg transition-all duration-200 min-h-11"

// Secundario
className="border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white px-6 py-3 rounded-lg transition-all duration-200 min-h-11"
```

### Inputs y Áreas Interactivas
- Bordes visibles: `border-2 border-gray-300 focus:border-brand-purple`
- Estados focus claros: `focus:ring-2 focus:ring-brand-purple focus:outline-none`
- Errores: usar color de contraste alto (no brand colors)

### Tipografía
- Body text mínimo: `text-base` (16px) en móvil
- Jerarquía con font-weight: `font-normal`, `font-semibold`, `font-bold`
- Títulos: `text-2xl md:text-3xl lg:text-4xl font-bold`

## Accesibilidad (Requisitos)
- Contraste WCAG AA mínimo entre texto y fondo
- Todos los elementos interactivos deben tener estados focus visibles
- Imágenes con atributo `alt` descriptivo
- Tamaños táctiles mínimos 44x44px en móvil

## Componentes Reutilizables
- Crear componentes personalizados para elementos comunes (botones, inputs, cards)
- Mantener consistencia visual en toda la aplicación
- Documentar patrones de uso en comentarios del código