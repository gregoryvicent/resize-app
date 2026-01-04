/**
 * Componente SocialRectangle
 * Renderiza un rectángulo animado que representa una plataforma de red social
 */

'use client';

import { useTranslations } from '@/lib/i18n';
import type { SocialRectangleProps } from './types';
import { ANIMATION_CONFIG } from './constants';
import styles from './SocialRectangle.module.css';

/**
 * Componente presentacional que muestra un rectángulo de red social con animación de opacidad.
 * 
 * @param platform - Datos de la plataforma (dimensiones, posición, etc.)
 * @param isVisible - Estado de visibilidad que controla la opacidad
 * 
 * @example
 * <SocialRectangle 
 *   platform={SOCIAL_PLATFORMS[0]} 
 *   isVisible={true} 
 * />
 */
export function SocialRectangle({ platform, isVisible }: SocialRectangleProps) {
  const { translations } = useTranslations();
  
  // Obtener la etiqueta traducida de la plataforma
  const platformLabel = translations?.hero?.platforms?.[platform.id as keyof typeof translations.hero.platforms] || platform.name;
  
  // Calcular tamaños responsive: 60% del tamaño en móvil, 100% en desktop
  const mobileWidth = Math.round(platform.width * 0.6);
  const mobileHeight = Math.round(platform.height * 0.6);
  
  return (
    <div
      className="absolute transition-opacity"
      style={{
        ...platform.position,
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${ANIMATION_CONFIG.transitionDuration}ms`,
        transitionTimingFunction: ANIMATION_CONFIG.easingFunction,
        willChange: 'opacity'
      }}
      aria-hidden="true"
    >
      <div 
        className={`w-full h-full border-2 border-brand-purple bg-brand-dark/30 rounded-lg backdrop-blur-sm flex items-end justify-center p-3 ${styles.rectangle}`}
        style={{
          // Tamaños base para móvil (60% del original)
          width: `${mobileWidth}px`,
          height: `${mobileHeight}px`,
          // En desktop (768px+), usar tamaño completo
          ['--desktop-width' as string]: `${platform.width}px`,
          ['--desktop-height' as string]: `${platform.height}px`
        }}
      >
        <span className="text-sm md:text-base text-white/80 font-medium truncate max-w-full">
          {platformLabel}
        </span>
      </div>
    </div>
  );
}
