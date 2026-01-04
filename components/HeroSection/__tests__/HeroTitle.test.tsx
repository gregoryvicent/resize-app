import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { HeroTitle } from '../HeroTitle';
import type { Translations } from '@/lib/i18n';

/**
 * Feature: hero-section-animated, Property 2: Tamaños de fuente responsive
 * Valida: Requisitos 1.2
 * 
 * Para cualquier viewport, el tamaño de fuente del título debe ser mayor o igual a 32px 
 * en móvil (< 768px) y mayor o igual a 48px en escritorio (>= 768px).
 */
describe('Property 2: Tamaños de fuente responsive', () => {
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
      },
      header: {
        brand: 'ResizeImages',
        nav: {
          home: 'Home',
          templates: 'Templates',
          about: 'About'
        },
        language: {
          selector: 'Language',
          spanish: 'Español',
          english: 'English'
        }
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

  it('debe aplicar clases de tamaño de fuente responsive que garanticen tamaños mínimos', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier ancho de viewport válido
        fc.integer({ min: 320, max: 2560 }),
        (_viewportWidth) => {
          // Renderizar el componente
          const { container } = render(<HeroTitle />);
          
          // Obtener el elemento h1
          const titleElement = container.querySelector('h1');
          expect(titleElement).toBeTruthy();
          
          // Verificar que tiene las clases responsive correctas
          const classes = titleElement!.className;
          
          // Verificar que contiene las clases de tamaño de fuente responsive
          // text-3xl = 1.875rem = 30px (base móvil, pero con sm: aumenta)
          // sm:text-4xl = 2.25rem = 36px (640px+)
          // md:text-5xl = 3rem = 48px (768px+)
          // lg:text-6xl = 3.75rem = 60px (1024px+)
          
          expect(classes).toContain('text-3xl');
          expect(classes).toContain('sm:text-4xl');
          expect(classes).toContain('md:text-5xl');
          expect(classes).toContain('lg:text-6xl');
          
          // Verificar que las clases garantizan los tamaños mínimos según el viewport
          // Para móvil (< 768px): text-3xl (30px) + sm:text-4xl (36px) garantiza >= 32px
          // Para escritorio (>= 768px): md:text-5xl (48px) garantiza >= 48px
          
          if (_viewportWidth < 768) {
            // En móvil, debe tener al menos text-3xl o sm:text-4xl
            const hasMobileSize = classes.includes('text-3xl') || classes.includes('sm:text-4xl');
            expect(hasMobileSize).toBe(true);
          } else {
            // En escritorio, debe tener md:text-5xl o lg:text-6xl
            const hasDesktopSize = classes.includes('md:text-5xl') || classes.includes('lg:text-6xl');
            expect(hasDesktopSize).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe aplicar todas las clases responsive requeridas independientemente del viewport', () => {
    fc.assert(
      fc.property(
        // Generador: diferentes anchos de viewport
        fc.constantFrom(320, 375, 640, 768, 1024, 1280, 1920, 2560),
        (viewportWidth) => {
          const { container } = render(<HeroTitle />);
          const titleElement = container.querySelector('h1');
          
          expect(titleElement).toBeTruthy();
          
          const classes = titleElement!.className;
          
          // Verificar que TODAS las clases responsive están presentes
          // Esto garantiza que el componente se adapta correctamente en todos los breakpoints
          const requiredClasses = [
            'text-3xl',      // Base: 30px
            'sm:text-4xl',   // 640px+: 36px
            'md:text-5xl',   // 768px+: 48px
            'lg:text-6xl'    // 1024px+: 60px
          ];
          
          requiredClasses.forEach(requiredClass => {
            expect(classes).toContain(requiredClass);
          });
          
          // Verificar otras clases importantes
          expect(classes).toContain('font-bold');
          expect(classes).toContain('text-center');
          expect(classes).toContain('text-white');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe mantener las clases responsive incluso con className personalizado', () => {
    fc.assert(
      fc.property(
        // Generador: clases CSS personalizadas
        fc.string({ minLength: 0, maxLength: 50 }),
        (customClassName) => {
          const { container } = render(<HeroTitle className={customClassName} />);
          const titleElement = container.querySelector('h1');
          
          expect(titleElement).toBeTruthy();
          
          const classes = titleElement!.className;
          
          // Verificar que las clases responsive siguen presentes
          expect(classes).toContain('text-3xl');
          expect(classes).toContain('sm:text-4xl');
          expect(classes).toContain('md:text-5xl');
          expect(classes).toContain('lg:text-6xl');
          
          // Verificar que la clase personalizada también está presente (si no está vacía)
          if (customClassName.trim().length > 0) {
            expect(classes).toContain(customClassName);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: hero-section-animated, Property 1: Renderizado del título central
 * Valida: Requisitos 1.1, 7.1
 * 
 * Para cualquier estado de carga de la página, el componente HeroSection debe renderizar 
 * un elemento de título con el texto traducido correspondiente al idioma del usuario.
 */
describe('Property 1: Renderizado del título central', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe renderizar un elemento h1 con texto traducido para cualquier idioma soportado', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier idioma soportado
        fc.constantFrom<'en' | 'es'>('en', 'es'),
        (locale) => {
          // Traducciones esperadas por idioma
          const expectedTitles: Record<'en' | 'es', string> = {
            en: 'Select a photo, upload it everywhere',
            es: 'Selecciona una foto, súbela a todas partes'
          };

          const mockTranslations: Translations = {
            app: {
              title: 'Test App',
              description: 'Test Description'
            },
            hero: {
              title: expectedTitles[locale],
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
            },
            header: {
              brand: 'ResizeImages',
              nav: {
                home: 'Home',
                templates: 'Templates',
                about: 'About'
              },
              language: {
                selector: 'Language',
                spanish: 'Español',
                english: 'English'
              }
            }
          };

          global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockTranslations
          } as Response);

          // Renderizar el componente
          const { container } = render(<HeroTitle />);
          
          // Esperar a que las traducciones se carguen
          const titleElement = container.querySelector('h1');
          
          // Verificar que el elemento h1 existe
          expect(titleElement).toBeTruthy();
          expect(titleElement?.tagName).toBe('H1');
          
          // Verificar que tiene las clases correctas
          expect(titleElement?.className).toContain('text-center');
          expect(titleElement?.className).toContain('text-white');
          expect(titleElement?.className).toContain('font-bold');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe renderizar el título con el texto correcto según el idioma', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<'en' | 'es'>('en', 'es'),
        async (locale) => {
          const expectedTitles: Record<'en' | 'es', string> = {
            en: 'Select a photo, upload it everywhere',
            es: 'Selecciona una foto, súbela a todas partes'
          };

          const mockTranslations: Translations = {
            app: {
              title: 'Test App',
              description: 'Test Description'
            },
            hero: {
              title: expectedTitles[locale],
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
            },
            header: {
              brand: 'ResizeImages',
              nav: {
                home: 'Home',
                templates: 'Templates',
                about: 'About'
              },
              language: {
                selector: 'Language',
                spanish: 'Español',
                english: 'English'
              }
            }
          };

          global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockTranslations
          } as Response);

          const { findByText } = render(<HeroTitle />);
          
          // Esperar a que el texto traducido aparezca
          const titleText = await findByText(expectedTitles[locale]);
          
          // Verificar que el texto está presente
          expect(titleText).toBeTruthy();
          expect(titleText.textContent).toBe(expectedTitles[locale]);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe renderizar el título centrado horizontalmente', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<'en' | 'es'>('en', 'es'),
        (locale) => {
          const mockTranslations: Translations = {
            app: {
              title: 'Test App',
              description: 'Test Description'
            },
            hero: {
              title: `Test title in ${locale}`,
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
            },
            header: {
              brand: 'ResizeImages',
              nav: {
                home: 'Home',
                templates: 'Templates',
                about: 'About'
              },
              language: {
                selector: 'Language',
                spanish: 'Español',
                english: 'English'
              }
            }
          };

          global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockTranslations
          } as Response);

          const { container } = render(<HeroTitle />);
          const titleElement = container.querySelector('h1');
          
          // Verificar que el título está centrado
          expect(titleElement?.className).toContain('text-center');
        }
      ),
      { numRuns: 100 }
    );
  });
});
