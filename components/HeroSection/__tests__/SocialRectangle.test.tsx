/**
 * Tests de propiedad para el componente SocialRectangle
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { SocialRectangle } from '../SocialRectangle';
import { SOCIAL_PLATFORMS } from '../constants';
import type { Translations } from '@/lib/i18n';

/**
 * Feature: hero-section-animated, Property 7: Proporciones de aspecto correctas
 * Valida: Requisitos 2.3
 * 
 * Para cualquier plataforma de red social definida, la proporción de aspecto (width/height) 
 * del rectángulo debe coincidir con la proporción especificada para esa plataforma 
 * con una tolerancia de ±0.01.
 */
describe('Property 7: Proporciones de aspecto correctas', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    
    // Mock de traducciones
    const mockTranslations: Translations = {
      app: {
        title: 'Test App',
        description: 'Test Description'
      },
      hero: {
        title: 'Test Hero Title',
        platforms: {
          'instagram-post': 'Instagram Post',
          'instagram-story': 'Instagram Story',
          'facebook-post': 'Facebook',
          'twitter-post': 'Twitter',
          'linkedin-post': 'LinkedIn',
          'youtube-thumbnail': 'YouTube'
        }
      },
      uploadZone: {
        title: 'Test',
        description: 'Test',
        dragActive: 'Test'
      },
      uploadButton: {
        label: 'Test',
        ariaLabel: 'Test'
      },
      errors: {
        invalidFormat: 'Test',
        fileTooLarge: 'Test',
        multipleFiles: 'Test'
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTranslations
    } as Response);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe mantener la proporción de aspecto correcta para todas las plataformas definidas', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier plataforma del array SOCIAL_PLATFORMS
        fc.constantFrom(...SOCIAL_PLATFORMS),
        // Generador: estado de visibilidad
        fc.boolean(),
        (platform, isVisible) => {
          // Renderizar el componente
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={isVisible} />
          );
          
          // Obtener el elemento contenedor del rectángulo
          const rectangleElement = container.querySelector('[aria-hidden="true"]');
          expect(rectangleElement).toBeTruthy();
          
          // Extraer las dimensiones del estilo inline
          const style = (rectangleElement as HTMLElement).style;
          const widthStr = style.width;
          const heightStr = style.height;
          
          // Verificar que las dimensiones están definidas
          expect(widthStr).toBeTruthy();
          expect(heightStr).toBeTruthy();
          
          // Extraer valores numéricos (remover 'px')
          const width = parseFloat(widthStr.replace('px', ''));
          const height = parseFloat(heightStr.replace('px', ''));
          
          // Calcular la proporción de aspecto real
          const actualAspectRatio = width / height;
          
          // Verificar que la proporción de aspecto coincide con la especificada
          // con una tolerancia de ±0.01
          const tolerance = 0.01;
          const difference = Math.abs(actualAspectRatio - platform.aspectRatio);
          
          expect(difference).toBeLessThanOrEqual(tolerance);
          
          // Verificar también que las dimensiones coinciden con las especificadas
          expect(width).toBe(platform.width);
          expect(height).toBe(platform.height);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe calcular correctamente la proporción de aspecto a partir de width y height', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        (platform) => {
          // Calcular la proporción de aspecto esperada
          const expectedAspectRatio = platform.width / platform.height;
          
          // Verificar que coincide con el aspectRatio definido en la plataforma
          const tolerance = 0.01;
          const difference = Math.abs(expectedAspectRatio - platform.aspectRatio);
          
          expect(difference).toBeLessThanOrEqual(tolerance);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe mantener proporciones de aspecto consistentes independientemente del estado de visibilidad', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        fc.boolean(),
        fc.boolean(),
        (platform, isVisible1, isVisible2) => {
          // Renderizar el componente con el primer estado de visibilidad
          const { container: container1 } = render(
            <SocialRectangle platform={platform} isVisible={isVisible1} />
          );
          
          // Renderizar el componente con el segundo estado de visibilidad
          const { container: container2 } = render(
            <SocialRectangle platform={platform} isVisible={isVisible2} />
          );
          
          // Obtener dimensiones del primer renderizado
          const rect1 = container1.querySelector('[aria-hidden="true"]') as HTMLElement;
          const width1 = parseFloat(rect1.style.width.replace('px', ''));
          const height1 = parseFloat(rect1.style.height.replace('px', ''));
          const aspectRatio1 = width1 / height1;
          
          // Obtener dimensiones del segundo renderizado
          const rect2 = container2.querySelector('[aria-hidden="true"]') as HTMLElement;
          const width2 = parseFloat(rect2.style.width.replace('px', ''));
          const height2 = parseFloat(rect2.style.height.replace('px', ''));
          const aspectRatio2 = width2 / height2;
          
          // Verificar que las proporciones de aspecto son idénticas
          // independientemente del estado de visibilidad
          expect(aspectRatio1).toBe(aspectRatio2);
          
          // Verificar que ambas coinciden con la proporción especificada
          const tolerance = 0.01;
          expect(Math.abs(aspectRatio1 - platform.aspectRatio)).toBeLessThanOrEqual(tolerance);
          expect(Math.abs(aspectRatio2 - platform.aspectRatio)).toBeLessThanOrEqual(tolerance);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe verificar que todas las plataformas en SOCIAL_PLATFORMS tienen proporciones válidas', () => {
    // Este test verifica que la configuración de plataformas es correcta
    SOCIAL_PLATFORMS.forEach(platform => {
      // Calcular la proporción de aspecto real
      const calculatedAspectRatio = platform.width / platform.height;
      
      // Verificar que coincide con el aspectRatio declarado
      const tolerance = 0.01;
      const difference = Math.abs(calculatedAspectRatio - platform.aspectRatio);
      
      expect(difference).toBeLessThanOrEqual(tolerance);
      
      // Verificar que las dimensiones son positivas
      expect(platform.width).toBeGreaterThan(0);
      expect(platform.height).toBeGreaterThan(0);
      
      // Verificar que el aspectRatio es positivo
      expect(platform.aspectRatio).toBeGreaterThan(0);
    });
  });
});

/**
 * Feature: hero-section-animated, Property 6: Etiquetas en todos los rectángulos
 * Valida: Requisitos 2.2
 * 
 * Para cualquier rectángulo de red social renderizado, debe incluir una etiqueta visible
 * que identifique la plataforma. La etiqueta debe estar presente en el DOM y ser legible.
 */
describe('Property 6: Etiquetas en todos los rectángulos', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    
    // Mock de traducciones
    const mockTranslations: Translations = {
      app: {
        title: 'Test App',
        description: 'Test Description'
      },
      hero: {
        title: 'Test Hero Title',
        platforms: {
          'instagram-post': 'Instagram Post',
          'instagram-story': 'Instagram Story',
          'facebook-post': 'Facebook',
          'twitter-post': 'Twitter',
          'linkedin-post': 'LinkedIn',
          'youtube-thumbnail': 'YouTube'
        }
      },
      uploadZone: {
        title: 'Test',
        description: 'Test',
        dragActive: 'Test'
      },
      uploadButton: {
        label: 'Test',
        ariaLabel: 'Test'
      },
      errors: {
        invalidFormat: 'Test',
        fileTooLarge: 'Test',
        multipleFiles: 'Test'
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTranslations
    } as Response);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe incluir una etiqueta visible para cada rectángulo de red social', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier plataforma del array SOCIAL_PLATFORMS
        fc.constantFrom(...SOCIAL_PLATFORMS),
        // Generador: estado de visibilidad
        fc.boolean(),
        (platform, isVisible) => {
          // Renderizar el componente
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={isVisible} />
          );
          
          // Verificar que el contenedor del rectángulo existe
          const rectangleElement = container.querySelector('[aria-hidden="true"]');
          expect(rectangleElement).toBeTruthy();
          
          // Buscar el elemento span que contiene la etiqueta
          const labelElement = rectangleElement?.querySelector('span.text-xs');
          expect(labelElement).toBeTruthy();
          
          // Verificar que la etiqueta tiene contenido de texto
          const labelText = labelElement?.textContent;
          expect(labelText).toBeTruthy();
          expect(labelText?.trim().length).toBeGreaterThan(0);
          
          // Verificar que el texto de la etiqueta corresponde a la plataforma
          // Puede ser el nombre de la plataforma o su traducción
          expect(
            labelText === platform.name || 
            labelText?.toLowerCase().includes(platform.id.split('-')[0])
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe mantener la etiqueta visible independientemente del estado de visibilidad del rectángulo', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        fc.boolean(),
        (platform, isVisible) => {
          // Renderizar el componente
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={isVisible} />
          );
          
          // La etiqueta debe estar presente en el DOM independientemente de la opacidad del rectángulo
          const labelElement = container.querySelector('span.text-xs');
          expect(labelElement).toBeTruthy();
          
          // Verificar que la etiqueta tiene contenido
          const labelText = labelElement?.textContent;
          expect(labelText).toBeTruthy();
          expect(labelText?.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe aplicar estilos de texto correctos a las etiquetas', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        fc.boolean(),
        (platform, isVisible) => {
          // Renderizar el componente
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={isVisible} />
          );
          
          // Obtener el elemento de la etiqueta
          const labelElement = container.querySelector('span.text-xs');
          expect(labelElement).toBeTruthy();
          
          // Verificar que tiene las clases CSS correctas
          const classList = labelElement?.classList;
          expect(classList?.contains('text-xs')).toBe(true);
          expect(classList?.contains('text-white/80')).toBe(true);
          expect(classList?.contains('font-medium')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe posicionar la etiqueta correctamente dentro del rectángulo', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        fc.boolean(),
        (platform, isVisible) => {
          // Renderizar el componente
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={isVisible} />
          );
          
          // Obtener el contenedor interno del rectángulo
          const innerContainer = container.querySelector('.border-brand-purple');
          expect(innerContainer).toBeTruthy();
          
          // Verificar que tiene las clases de posicionamiento flex
          const classList = innerContainer?.classList;
          expect(classList?.contains('flex')).toBe(true);
          expect(classList?.contains('items-end')).toBe(true);
          expect(classList?.contains('justify-center')).toBe(true);
          
          // Verificar que la etiqueta está dentro del contenedor
          const labelElement = innerContainer?.querySelector('span.text-xs');
          expect(labelElement).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe verificar que todas las plataformas en SOCIAL_PLATFORMS tienen etiquetas configuradas', () => {
    // Este test verifica que la configuración de plataformas incluye nombres
    SOCIAL_PLATFORMS.forEach(platform => {
      // Verificar que cada plataforma tiene un ID
      expect(platform.id).toBeTruthy();
      expect(platform.id.trim().length).toBeGreaterThan(0);
      
      // Verificar que cada plataforma tiene un nombre
      expect(platform.name).toBeTruthy();
      expect(platform.name.trim().length).toBeGreaterThan(0);
      
      // Renderizar el componente para verificar que la etiqueta se muestra
      const { container } = render(
        <SocialRectangle platform={platform} isVisible={true} />
      );
      
      const labelElement = container.querySelector('span.text-xs');
      expect(labelElement).toBeTruthy();
      expect(labelElement?.textContent?.trim().length).toBeGreaterThan(0);
    });
  });
});

/**
 * Feature: hero-section-animated, Property 12: Valores de opacidad en transiciones
 * Valida: Requisitos 3.4, 3.5
 * 
 * Para cualquier rectángulo, cuando isVisible es true la opacidad debe ser 1,
 * y cuando isVisible es false la opacidad debe ser 0.
 */
describe('Property 12: Valores de opacidad en transiciones', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    
    // Mock de traducciones
    const mockTranslations: Translations = {
      app: {
        title: 'Test App',
        description: 'Test Description'
      },
      hero: {
        title: 'Test Hero Title',
        platforms: {
          'instagram-post': 'Instagram Post',
          'instagram-story': 'Instagram Story',
          'facebook-post': 'Facebook',
          'twitter-post': 'Twitter',
          'linkedin-post': 'LinkedIn',
          'youtube-thumbnail': 'YouTube'
        }
      },
      uploadZone: {
        title: 'Test',
        description: 'Test',
        dragActive: 'Test'
      },
      uploadButton: {
        label: 'Test',
        ariaLabel: 'Test'
      },
      errors: {
        invalidFormat: 'Test',
        fileTooLarge: 'Test',
        multipleFiles: 'Test'
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTranslations
    } as Response);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe tener opacidad 1 cuando isVisible es true', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier plataforma del array SOCIAL_PLATFORMS
        fc.constantFrom(...SOCIAL_PLATFORMS),
        (platform) => {
          // Renderizar el componente con isVisible=true
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={true} />
          );
          
          // Obtener el elemento contenedor del rectángulo
          const rectangleElement = container.querySelector('[aria-hidden="true"]') as HTMLElement;
          expect(rectangleElement).toBeTruthy();
          
          // Verificar que la opacidad es 1
          const opacity = rectangleElement.style.opacity;
          expect(opacity).toBe('1');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe tener opacidad 0 cuando isVisible es false', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier plataforma del array SOCIAL_PLATFORMS
        fc.constantFrom(...SOCIAL_PLATFORMS),
        (platform) => {
          // Renderizar el componente con isVisible=false
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={false} />
          );
          
          // Obtener el elemento contenedor del rectángulo
          const rectangleElement = container.querySelector('[aria-hidden="true"]') as HTMLElement;
          expect(rectangleElement).toBeTruthy();
          
          // Verificar que la opacidad es 0
          const opacity = rectangleElement.style.opacity;
          expect(opacity).toBe('0');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe cambiar la opacidad correctamente al cambiar isVisible', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        (platform) => {
          // Renderizar con isVisible=false
          const { container: container1 } = render(
            <SocialRectangle platform={platform} isVisible={false} />
          );
          
          const rect1 = container1.querySelector('[aria-hidden="true"]') as HTMLElement;
          expect(rect1.style.opacity).toBe('0');
          
          // Renderizar con isVisible=true
          const { container: container2 } = render(
            <SocialRectangle platform={platform} isVisible={true} />
          );
          
          const rect2 = container2.querySelector('[aria-hidden="true"]') as HTMLElement;
          expect(rect2.style.opacity).toBe('1');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe aplicar transición de opacidad con clase transition-opacity', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        fc.boolean(),
        (platform, isVisible) => {
          // Renderizar el componente
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={isVisible} />
          );
          
          // Obtener el elemento contenedor del rectángulo
          const rectangleElement = container.querySelector('[aria-hidden="true"]');
          expect(rectangleElement).toBeTruthy();
          
          // Verificar que tiene la clase transition-opacity
          const classList = rectangleElement?.classList;
          expect(classList?.contains('transition-opacity')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe mantener valores de opacidad binarios (0 o 1) sin valores intermedios', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SOCIAL_PLATFORMS),
        fc.boolean(),
        (platform, isVisible) => {
          // Renderizar el componente
          const { container } = render(
            <SocialRectangle platform={platform} isVisible={isVisible} />
          );
          
          // Obtener el elemento contenedor del rectángulo
          const rectangleElement = container.querySelector('[aria-hidden="true"]') as HTMLElement;
          expect(rectangleElement).toBeTruthy();
          
          // Verificar que la opacidad es exactamente 0 o 1
          const opacity = parseFloat(rectangleElement.style.opacity);
          expect(opacity === 0 || opacity === 1).toBe(true);
          
          // Verificar que coincide con el estado de visibilidad
          if (isVisible) {
            expect(opacity).toBe(1);
          } else {
            expect(opacity).toBe(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe verificar que todas las plataformas respetan los valores de opacidad', () => {
    // Test exhaustivo de todas las plataformas con ambos estados
    SOCIAL_PLATFORMS.forEach(platform => {
      // Test con isVisible=true
      const { container: containerVisible } = render(
        <SocialRectangle platform={platform} isVisible={true} />
      );
      
      const rectVisible = containerVisible.querySelector('[aria-hidden="true"]') as HTMLElement;
      expect(rectVisible.style.opacity).toBe('1');
      
      // Test con isVisible=false
      const { container: containerHidden } = render(
        <SocialRectangle platform={platform} isVisible={false} />
      );
      
      const rectHidden = containerHidden.querySelector('[aria-hidden="true"]') as HTMLElement;
      expect(rectHidden.style.opacity).toBe('0');
    });
  });
});
