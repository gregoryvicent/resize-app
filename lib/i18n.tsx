'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

/**
 * Idiomas soportados por la aplicación.
 */
export type SupportedLocale = 'en' | 'es';

/**
 * Estructura de las traducciones de la aplicación.
 */
export interface Translations {
  app: {
    title: string;
    description: string;
  };
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
  hero: {
    title: string;
    platforms: {
      'instagram-post': string;
      'instagram-story': string;
      'facebook-post': string;
      'twitter-post': string;
      'linkedin-post': string;
      'youtube-thumbnail': string;
    };
  };
  uploadZone: {
    title: string;
    description: string;
    dragActive: string;
  };
  uploadButton: {
    label: string;
    ariaLabel: string;
  };
  errors: {
    invalidFormat: string;
    fileTooLarge: string;
    multipleFiles: string;
  };
}

/**
 * Contexto de traducciones
 */
interface TranslationsContextType {
  locale: SupportedLocale;
  translations: Translations | null;
  isLoading: boolean;
  setLocale: (locale: SupportedLocale) => void;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

/**
 * Detecta el idioma preferido del navegador del usuario.
 */
export function getBrowserLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
}

/**
 * Carga el archivo de traducciones correspondiente al idioma especificado.
 */
export async function loadTranslations(locale: SupportedLocale): Promise<Translations> {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load translations for locale: ${locale}`);
    }
    
    const translations: Translations = await response.json();
    return translations;
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    
    if (locale !== 'en') {
      return loadTranslations('en');
    }
    
    return {
      app: {
        title: 'Resize Images',
        description: 'Resize your images quickly and easily for social media'
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
  }
}

/**
 * Proveedor de contexto de traducciones
 */
export function TranslationsProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectedLocale = getBrowserLocale();
    setLocaleState(detectedLocale);
    
    loadTranslations(detectedLocale)
      .then((loadedTranslations) => {
        setTranslations(loadedTranslations);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading translations:', error);
        setIsLoading(false);
      });
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    if (newLocale === locale) return;
    
    setLocaleState(newLocale);
    setIsLoading(true);
    
    loadTranslations(newLocale)
      .then((loadedTranslations) => {
        setTranslations(loadedTranslations);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading translations:', error);
        setIsLoading(false);
      });
  };

  const value = { locale, translations, isLoading, setLocale };

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}

/**
 * Hook personalizado para manejar la internacionalización de la aplicación.
 */
export function useTranslations() {
  const context = useContext(TranslationsContext);
  
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  
  return context;
}
