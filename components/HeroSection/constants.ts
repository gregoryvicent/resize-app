/**
 * Constantes de configuración para el componente HeroSection
 */

import type { SocialPlatform } from './types';

/**
 * Configuración de plataformas de redes sociales
 * Incluye dimensiones, proporciones de aspecto y timing de animación
 * Las posiciones están optimizadas para evitar saturación visual en móvil
 */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    aspectRatio: 1, // 1:1
    width: 240,
    height: 240,
    position: { top: '10%', left: '5%' },
    animationDelay: 0,
    duration: 2000
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    aspectRatio: 0.5625, // 9:16
    width: 160,
    height: 284,
    position: { top: '15%', right: '8%' },
    animationDelay: 500,
    duration: 2000
  },
  {
    id: 'facebook-post',
    name: 'Facebook',
    aspectRatio: 150 / 78, // 1.923:1 (calculado exactamente)
    width: 300,
    height: 156,
    position: { bottom: '20%', left: '5%' },
    animationDelay: 1000,
    duration: 2000
  },
  {
    id: 'twitter-post',
    name: 'Twitter',
    aspectRatio: 140 / 78, // 1.795:1 (calculado exactamente)
    width: 280,
    height: 156,
    position: { top: '45%', right: '5%' },
    animationDelay: 1500,
    duration: 2000
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn',
    aspectRatio: 130 / 68, // 1.912:1 (calculado exactamente)
    width: 260,
    height: 136,
    position: { bottom: '10%', right: '8%' },
    animationDelay: 2000,
    duration: 2000
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube',
    aspectRatio: 160 / 90, // 1.778:1 (calculado exactamente)
    width: 320,
    height: 180,
    position: { top: '55%', left: '3%' },
    animationDelay: 2500,
    duration: 2000
  }
];

/**
 * Configuración de animación
 */
export const ANIMATION_CONFIG = {
  /** Duración de transición de opacidad en milisegundos */
  transitionDuration: 600,
  /** Duración total del ciclo de animación en milisegundos */
  cycleDuration: 8000,
  /** Función de easing para transiciones */
  easingFunction: 'ease-in-out'
} as const;
