import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { loadTranslations, getBrowserLocale, type SupportedLocale, type Translations } from '../i18n';

/**
 * Feature: hero-section-animated, Property 20: Obtención de traducciones desde archivos JSON
 * Valida: Requisitos 7.4
 * 
 * Para cualquier texto mostrado en la sección Hero (título y etiquetas), el contenido 
 * debe provenir de los archivos de traducción JSON correspondientes al idioma activo.
 */
describe('Property 20: Obtención de traducciones desde archivos JSON', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe cargar las traducciones de hero desde archivos JSON para cualquier idioma soportado', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generador: cualquier idioma soportado
        fc.constantFrom<SupportedLocale>('en', 'es'),
        async (locale) => {
          // Mock de las traducciones esperadas para cada idioma
          const expectedTranslations: Record<SupportedLocale, Partial<Translations>> = {
            en: {
              hero: {
                title: 'Select a photo, upload it everywhere',
                platforms: {
                  'instagram-post': 'Instagram Post',
                  'instagram-story': 'Instagram Story',
                  'facebook-post': 'Facebook',
                  'twitter-post': 'Twitter',
                  'linkedin-post': 'LinkedIn',
                  'youtube-thumbnail': 'YouTube'
                }
              }
            },
            es: {
              hero: {
                title: 'Selecciona una foto, súbela a todas partes',
                platforms: {
                  'instagram-post': 'Instagram Post',
                  'instagram-story': 'Instagram Story',
                  'facebook-post': 'Facebook',
                  'twitter-post': 'Twitter',
                  'linkedin-post': 'LinkedIn',
                  'youtube-thumbnail': 'YouTube'
                }
              }
            }
          };

          // Mock de fetch para simular la carga del archivo JSON
          global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
              app: { title: 'Test', description: 'Test' },
              ...expectedTranslations[locale],
              uploadZone: { title: 'Test', description: 'Test', dragActive: 'Test' },
              uploadButton: { label: 'Test', ariaLabel: 'Test' },
              errors: { invalidFormat: 'Test', fileTooLarge: 'Test', multipleFiles: 'Test' }
            })
          } as Response);

          // Cargar traducciones
          const translations = await loadTranslations(locale);

          // Verificar que se llamó a fetch con la URL correcta
          expect(global.fetch).toHaveBeenCalledWith(`/locales/${locale}.json`);

          // Verificar que la sección hero está presente
          expect(translations.hero).toBeDefined();
          expect(translations.hero.title).toBeDefined();
          expect(translations.hero.platforms).toBeDefined();

          // Verificar que todas las plataformas están presentes
          expect(translations.hero.platforms['instagram-post']).toBeDefined();
          expect(translations.hero.platforms['instagram-story']).toBeDefined();
          expect(translations.hero.platforms['facebook-post']).toBeDefined();
          expect(translations.hero.platforms['twitter-post']).toBeDefined();
          expect(translations.hero.platforms['linkedin-post']).toBeDefined();
          expect(translations.hero.platforms['youtube-thumbnail']).toBeDefined();

          // Verificar que el título corresponde al idioma correcto
          expect(translations.hero.title).toBe(expectedTranslations[locale].hero!.title);

          // Verificar que los nombres de plataformas son strings no vacíos
          Object.values(translations.hero.platforms).forEach(platformName => {
            expect(typeof platformName).toBe('string');
            expect(platformName.length).toBeGreaterThan(0);
          });

          // Verificar que el título es diferente según el idioma
          if (locale === 'en') {
            expect(translations.hero.title).toBe('Select a photo, upload it everywhere');
          } else if (locale === 'es') {
            expect(translations.hero.title).toBe('Selecciona una foto, súbela a todas partes');
          }
        }
      ),
      { numRuns: 100 } // Ejecutar 100 iteraciones como especifica el diseño
    );
  });

  it('debe cargar todas las claves de plataformas requeridas desde JSON', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<SupportedLocale>('en', 'es'),
        async (locale) => {
          const requiredPlatforms = [
            'instagram-post',
            'instagram-story',
            'facebook-post',
            'twitter-post',
            'linkedin-post',
            'youtube-thumbnail'
          ];

          const mockTranslations: Translations = {
            app: { title: 'Test', description: 'Test' },
            hero: {
              title: `Hero title in ${locale}`,
              platforms: {
                'instagram-post': 'Instagram Post',
                'instagram-story': 'Instagram Story',
                'facebook-post': 'Facebook',
                'twitter-post': 'Twitter',
                'linkedin-post': 'LinkedIn',
                'youtube-thumbnail': 'YouTube'
              }
            },
            uploadZone: { title: 'Test', description: 'Test', dragActive: 'Test' },
            uploadButton: { label: 'Test', ariaLabel: 'Test' },
            errors: { invalidFormat: 'Test', fileTooLarge: 'Test', multipleFiles: 'Test' }
          };

          global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockTranslations
          } as Response);

          const translations = await loadTranslations(locale);

          // Verificar que todas las plataformas requeridas están presentes
          requiredPlatforms.forEach(platform => {
            expect(translations.hero.platforms[platform as keyof typeof translations.hero.platforms]).toBeDefined();
            expect(typeof translations.hero.platforms[platform as keyof typeof translations.hero.platforms]).toBe('string');
            expect(translations.hero.platforms[platform as keyof typeof translations.hero.platforms].length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: image-upload-interface, Property 8: Carga de traducciones correctas
 * Valida: Requisitos 7.2, 7.3, 7.4
 * 
 * Para cualquier idioma soportado (en, es), el sistema debe cargar el archivo 
 * de traducción correspondiente y mostrar los textos en ese idioma.
 */
describe('Property 8: Carga de traducciones correctas', () => {
  // Mock de fetch global
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe cargar las traducciones correctas para cualquier idioma soportado', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generador: cualquier idioma soportado
        fc.constantFrom<SupportedLocale>('en', 'es'),
        async (locale) => {
          // Mock de las traducciones esperadas para cada idioma
          const expectedTranslations: Record<SupportedLocale, Translations> = {
            en: {
              app: {
                title: 'Resize Images',
                description: 'Resize your images quickly and easily for social media'
              },
              hero: {
                title: 'Select a photo, upload it everywhere',
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
                title: 'Upload Image',
                description: 'Drag and drop an image here, or click to select',
                dragActive: 'Drop the image here'
              },
              uploadButton: {
                label: 'Select Image',
                ariaLabel: 'Select image from your device'
              },
              errors: {
                invalidFormat: 'Invalid file format. Please upload a JPEG, PNG, WebP, or GIF image.',
                fileTooLarge: 'File is too large. Maximum size is 10MB.',
                multipleFiles: 'Please upload only one image at a time.'
              }
            },
            es: {
              app: {
                title: 'Redimensionar Imágenes',
                description: 'Redimensiona tus imágenes de forma rápida y sencilla para redes sociales'
              },
              hero: {
                title: 'Selecciona una foto, súbela a todas partes',
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
                title: 'Subir Imagen',
                description: 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
                dragActive: 'Suelta la imagen aquí'
              },
              uploadButton: {
                label: 'Seleccionar Imagen',
                ariaLabel: 'Seleccionar imagen desde tu dispositivo'
              },
              errors: {
                invalidFormat: 'Formato de archivo inválido. Por favor sube una imagen JPEG, PNG, WebP o GIF.',
                fileTooLarge: 'El archivo es demasiado grande. El tamaño máximo es 10MB.',
                multipleFiles: 'Por favor sube solo una imagen a la vez.'
              }
            }
          };

          // Mock de fetch para simular la carga del archivo JSON
          global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => expectedTranslations[locale]
          } as Response);

          // Cargar traducciones
          const translations = await loadTranslations(locale);

          // Verificar que las traducciones cargadas corresponden al idioma solicitado
          expect(translations).toEqual(expectedTranslations[locale]);

          // Verificar que se llamó a fetch con la URL correcta
          expect(global.fetch).toHaveBeenCalledWith(`/locales/${locale}.json`);

          // Verificar que todas las claves requeridas están presentes
          expect(translations.uploadZone).toBeDefined();
          expect(translations.uploadZone.title).toBeDefined();
          expect(translations.uploadZone.description).toBeDefined();
          expect(translations.uploadZone.dragActive).toBeDefined();
          
          expect(translations.uploadButton).toBeDefined();
          expect(translations.uploadButton.label).toBeDefined();
          expect(translations.uploadButton.ariaLabel).toBeDefined();
          
          expect(translations.errors).toBeDefined();
          expect(translations.errors.invalidFormat).toBeDefined();
          expect(translations.errors.fileTooLarge).toBeDefined();
          expect(translations.errors.multipleFiles).toBeDefined();

          // Verificar que los textos son diferentes según el idioma
          if (locale === 'en') {
            expect(translations.uploadZone.title).toBe('Upload Image');
          } else if (locale === 'es') {
            expect(translations.uploadZone.title).toBe('Subir Imagen');
          }
        }
      ),
      { numRuns: 100 } // Ejecutar 100 iteraciones como especifica el diseño
    );
  });

  it('debe cargar traducciones con estructura válida para cualquier idioma', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<SupportedLocale>('en', 'es'),
        async (locale) => {
          // Mock de traducciones válidas
          const mockTranslations: Translations = {
            app: {
              title: `App title in ${locale}`,
              description: `App description in ${locale}`
            },
            hero: {
              title: `Hero title in ${locale}`,
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
              title: `Title in ${locale}`,
              description: `Description in ${locale}`,
              dragActive: `Drag active in ${locale}`
            },
            uploadButton: {
              label: `Label in ${locale}`,
              ariaLabel: `Aria label in ${locale}`
            },
            errors: {
              invalidFormat: `Invalid format in ${locale}`,
              fileTooLarge: `File too large in ${locale}`,
              multipleFiles: `Multiple files in ${locale}`
            }
          };

          global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockTranslations
          } as Response);

          const translations = await loadTranslations(locale);

          // Verificar que la estructura es correcta
          expect(typeof translations.uploadZone.title).toBe('string');
          expect(typeof translations.uploadZone.description).toBe('string');
          expect(typeof translations.uploadZone.dragActive).toBe('string');
          expect(typeof translations.uploadButton.label).toBe('string');
          expect(typeof translations.uploadButton.ariaLabel).toBe('string');
          expect(typeof translations.errors.invalidFormat).toBe('string');
          expect(typeof translations.errors.fileTooLarge).toBe('string');
          expect(typeof translations.errors.multipleFiles).toBe('string');

          // Verificar que ningún string está vacío
          expect(translations.uploadZone.title.length).toBeGreaterThan(0);
          expect(translations.uploadZone.description.length).toBeGreaterThan(0);
          expect(translations.uploadButton.label.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Unit tests para getBrowserLocale
 * Requisitos: 7.1, 7.3, 7.4
 */
describe('getBrowserLocale - Unit Tests', () => {
  let originalNavigator: Navigator;
  let originalWindow: Window & typeof globalThis;

  beforeEach(() => {
    originalNavigator = global.navigator;
    originalWindow = global.window;
  });

  afterEach(() => {
    global.navigator = originalNavigator;
    global.window = originalWindow;
  });

  it('debe retornar "es" cuando el idioma del navegador es español', () => {
    // Mock del navegador con idioma español
    Object.defineProperty(global, 'navigator', {
      value: { language: 'es-ES' },
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('es');
  });

  it('debe retornar "es" cuando el idioma del navegador es español sin región', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'es' },
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('es');
  });

  it('debe retornar "en" cuando el idioma del navegador es inglés', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'en-US' },
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('en');
  });

  it('debe retornar "en" cuando el idioma del navegador es inglés sin región', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'en' },
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('en');
  });

  it('debe retornar "en" como fallback cuando el idioma no es soportado (francés)', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'fr-FR' },
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('en');
  });

  it('debe retornar "en" como fallback cuando el idioma no es soportado (alemán)', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'de-DE' },
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('en');
  });

  it('debe retornar "en" como fallback cuando el idioma no es soportado (japonés)', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'ja-JP' },
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('en');
  });

  it('debe retornar "en" cuando se ejecuta en el servidor (window undefined)', () => {
    // Simular entorno de servidor
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
      configurable: true
    });

    const locale = getBrowserLocale();
    expect(locale).toBe('en');
  });
});

/**
 * Unit tests para loadTranslations
 * Requisitos: 7.1, 7.3, 7.4
 */
describe('loadTranslations - Unit Tests', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe cargar el archivo JSON correcto para inglés', async () => {
    const mockEnTranslations: Translations = {
      app: {
        title: 'Resize Images',
        description: 'Resize your images quickly and easily for social media'
      },
      hero: {
        title: 'Select a photo, upload it everywhere',
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
        title: 'Upload Image',
        description: 'Drag and drop an image here, or click to select',
        dragActive: 'Drop the image here'
      },
      uploadButton: {
        label: 'Select Image',
        ariaLabel: 'Select image from your device'
      },
      errors: {
        invalidFormat: 'Invalid file format. Please upload a JPEG, PNG, WebP, or GIF image.',
        fileTooLarge: 'File is too large. Maximum size is 10MB.',
        multipleFiles: 'Please upload only one image at a time.'
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEnTranslations
    } as Response);

    const translations = await loadTranslations('en');

    expect(global.fetch).toHaveBeenCalledWith('/locales/en.json');
    expect(translations).toEqual(mockEnTranslations);
  });

  it('debe cargar el archivo JSON correcto para español', async () => {
    const mockEsTranslations: Translations = {
      app: {
        title: 'Redimensionar Imágenes',
        description: 'Redimensiona tus imágenes de forma rápida y sencilla para redes sociales'
      },
      hero: {
        title: 'Selecciona una foto, súbela a todas partes',
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
        title: 'Subir Imagen',
        description: 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
        dragActive: 'Suelta la imagen aquí'
      },
      uploadButton: {
        label: 'Seleccionar Imagen',
        ariaLabel: 'Seleccionar imagen desde tu dispositivo'
      },
      errors: {
        invalidFormat: 'Formato de archivo inválido. Por favor sube una imagen JPEG, PNG, WebP o GIF.',
        fileTooLarge: 'El archivo es demasiado grande. El tamaño máximo es 10MB.',
        multipleFiles: 'Por favor sube solo una imagen a la vez.'
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEsTranslations
    } as Response);

    const translations = await loadTranslations('es');

    expect(global.fetch).toHaveBeenCalledWith('/locales/es.json');
    expect(translations).toEqual(mockEsTranslations);
  });

  it('debe hacer fallback a inglés cuando falla la carga de español', async () => {
    const mockEnTranslations: Translations = {
      app: {
        title: 'Resize Images',
        description: 'Resize your images quickly and easily for social media'
      },
      hero: {
        title: 'Select a photo, upload it everywhere',
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
        title: 'Upload Image',
        description: 'Drag and drop an image here, or click to select',
        dragActive: 'Drop the image here'
      },
      uploadButton: {
        label: 'Select Image',
        ariaLabel: 'Select image from your device'
      },
      errors: {
        invalidFormat: 'Invalid file format. Please upload a JPEG, PNG, WebP, or GIF image.',
        fileTooLarge: 'File is too large. Maximum size is 10MB.',
        multipleFiles: 'Please upload only one image at a time.'
      }
    };

    // Primera llamada falla (español), segunda llamada tiene éxito (inglés)
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => { throw new Error('Not found'); }
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnTranslations
      } as Response);

    const translations = await loadTranslations('es');

    // Verificar que se intentó cargar español primero
    expect(global.fetch).toHaveBeenCalledWith('/locales/es.json');
    // Verificar que se hizo fallback a inglés
    expect(global.fetch).toHaveBeenCalledWith('/locales/en.json');
    // Verificar que se retornaron las traducciones en inglés
    expect(translations).toEqual(mockEnTranslations);
  });

  it('debe retornar traducciones por defecto cuando falla la carga de inglés', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => { throw new Error('Not found'); }
    } as Response);

    const translations = await loadTranslations('en');

    // Verificar que se retornan traducciones por defecto en inglés
    expect(translations.hero.title).toBe('Select a photo, upload it everywhere');
    expect(translations.uploadZone.title).toBe('Upload Image');
    expect(translations.uploadButton.label).toBe('Select Image');
    expect(translations.errors.invalidFormat).toContain('Invalid file format');
  });

  it('debe manejar errores de red y hacer fallback correctamente', async () => {
    const mockEnTranslations: Translations = {
      app: {
        title: 'Resize Images',
        description: 'Resize your images quickly and easily for social media'
      },
      hero: {
        title: 'Select a photo, upload it everywhere',
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
        title: 'Upload Image',
        description: 'Drag and drop an image here, or click to select',
        dragActive: 'Drop the image here'
      },
      uploadButton: {
        label: 'Select Image',
        ariaLabel: 'Select image from your device'
      },
      errors: {
        invalidFormat: 'Invalid file format. Please upload a JPEG, PNG, WebP, or GIF image.',
        fileTooLarge: 'File is too large. Maximum size is 10MB.',
        multipleFiles: 'Please upload only one image at a time.'
      }
    };

    // Primera llamada lanza error de red, segunda tiene éxito
    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnTranslations
      } as Response);

    const translations = await loadTranslations('es');

    // Verificar que se hizo fallback a inglés después del error
    expect(translations).toEqual(mockEnTranslations);
  });
});
