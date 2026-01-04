/**
 * Componente HeroTitle
 * Muestra el título principal de la sección Hero con soporte de internacionalización
 */
'use client';

import { useTranslations } from '@/lib/i18n';
import type { HeroTitleProps } from './types';

/**
 * Componente que renderiza el título central de la sección Hero.
 * Utiliza el sistema de i18n para mostrar el texto en el idioma del usuario.
 * 
 * @param className - Clases CSS adicionales opcionales
 * @returns Elemento h1 con el título traducido
 * 
 * @example
 * <HeroTitle />
 * <HeroTitle className="custom-class" />
 */
export function HeroTitle({ className = '' }: HeroTitleProps) {
  const { translations, isLoading } = useTranslations();
  
  // Mostrar placeholder solo si no hay traducciones cargadas aún
  if (!translations) {
    return (
      <h1 
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white leading-tight ${className}`}
      >
        {/* Placeholder invisible para mantener el espacio */}
        <span className="opacity-0">Loading...</span>
      </h1>
    );
  }
  
  return (
    <h1 
      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white leading-tight ${className}`}
    >
      {translations.hero.title}
    </h1>
  );
}
