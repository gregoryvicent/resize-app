---
inclusion: always
---

# Estilo y Convenciones de Código

## Documentación de Código
- Usar docstrings estilo Google para funciones, componentes y métodos
- Incluir descripción, parámetros, retorno y ejemplos cuando sea relevante
- Comentarios en español, código en inglés

```typescript
/**
 * Redimensiona una imagen según las dimensiones especificadas.
 * 
 * @param image - La imagen a redimensionar
 * @param width - Ancho objetivo en píxeles
 * @param height - Alto objetivo en píxeles
 * @returns Promise con la imagen redimensionada
 */
async function resizeImage(image: File, width: number, height: number): Promise<Blob> {
  // implementación
}
```

## Estructura de Componentes

### Organización de Archivos
- Patrón obligatorio: `components/[ComponentName]/index.tsx`
- Un componente por carpeta con su archivo principal
- Archivos relacionados (tipos, estilos, tests) en la misma carpeta

```
components/
  ImageUploader/
    index.tsx
    types.ts
    useImageUpload.ts
```

### Composición de Componentes
- Dividir componentes grandes en subcomponentes más pequeños
- Máximo recomendado: 200-250 líneas por archivo
- Extraer lógica compleja a custom hooks
- Cada componente debe tener una responsabilidad única

```typescript
// ✅ Correcto: componente dividido
function ImageEditor() {
  return (
    <div>
      <ImageUploadZone />
      <TemplateSelector />
      <ImagePreview />
      <DownloadButton />
    </div>
  );
}

// ❌ Evitar: todo en un solo componente de 500+ líneas
```

## Principios de Diseño de Código

### DRY (Don't Repeat Yourself)
- Identificar patrones repetidos y extraerlos a funciones/componentes reutilizables
- Crear utilidades compartidas para lógica común
- Usar composición sobre duplicación

### Single Responsibility Principle
- Cada función/componente debe hacer una sola cosa bien
- Si un componente hace múltiples cosas, dividirlo
- Nombres descriptivos que reflejen la responsabilidad única

### Reutilización
- Diseñar componentes pensando en uso futuro
- Usar props para configuración en lugar de hardcodear valores
- Crear componentes genéricos cuando sea apropiado

```typescript
// ✅ Correcto: componente reutilizable
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}

// ❌ Evitar: componente específico no reutilizable
function SubmitImageButton() { /* ... */ }
```

## Separación de Lógica

### Custom Hooks
- Extraer lógica de estado y efectos a custom hooks
- Nombrar hooks con prefijo `use`
- Un hook por responsabilidad

```typescript
// ✅ Correcto: lógica en hook separado
function useImageResize(image: File | null) {
  const [resizedImage, setResizedImage] = useState<Blob | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  // lógica de redimensionamiento
  
  return { resizedImage, isResizing, resize };
}

function ImageEditor() {
  const { resizedImage, isResizing, resize } = useImageResize(image);
  // solo UI aquí
}
```

### Componentes de Presentación vs Contenedores
- Componentes de presentación: solo UI, reciben props
- Componentes contenedores: manejan lógica y estado
- Preferir componentes de presentación cuando sea posible

## Buenas Prácticas React y Next.js

### Server vs Client Components
- Por defecto usar Server Components
- Agregar `'use client'` solo cuando sea necesario:
  - Hooks de estado (useState, useEffect)
  - Event handlers
  - Browser APIs
  - Context providers

### Optimización
- Usar `React.memo()` para componentes que re-renderizan frecuentemente
- `useCallback` y `useMemo` para optimizar funciones y cálculos costosos
- `next/image` para todas las imágenes con lazy loading

### Manejo de Estado
- Estado local con `useState` para UI simple
- Custom hooks para lógica de estado compleja
- Context API solo para estado verdaderamente global

## TypeScript

### Tipado Estricto
- Evitar `any`, usar `unknown` si el tipo es desconocido
- Definir interfaces para todas las props de componentes
- Tipar retornos de funciones explícitamente

```typescript
// ✅ Correcto
interface ImageTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  platform: 'instagram' | 'facebook' | 'twitter';
}

function getTemplate(id: string): ImageTemplate | undefined {
  // implementación
}

// ❌ Evitar
function getTemplate(id: any): any {
  // implementación
}
```

### Nomenclatura
- Interfaces: PascalCase (ej: `ImageTemplate`)
- Types: PascalCase (ej: `ResizeOptions`)
- Componentes: PascalCase (ej: `ImageUploader`)
- Funciones/variables: camelCase (ej: `resizeImage`)
- Constantes: UPPER_SNAKE_CASE (ej: `MAX_FILE_SIZE`)

## Formato y Estilo

### Imports
- Agrupar imports: externos, internos, relativos
- Usar alias `@/` para imports desde la raíz

```typescript
// Externos
import { useState } from 'react';
import Image from 'next/image';

// Internos con alias
import { Button } from '@/components/Button';
import { resizeImage } from '@/utils/imageProcessing';

// Relativos
import { ImageTemplate } from './types';
```

### Orden en Componentes
1. Imports
2. Types/Interfaces
3. Constantes
4. Componente principal
5. Subcomponentes (si los hay)
6. Export

### Convenciones de Nombres de Archivos
- Componentes: PascalCase (ej: `ImageUploader/index.tsx`)
- Utilidades: camelCase (ej: `imageUtils.ts`)
- Tipos: camelCase con sufijo (ej: `imageTypes.ts`)
- Hooks: camelCase con prefijo use (ej: `useImageResize.ts`)