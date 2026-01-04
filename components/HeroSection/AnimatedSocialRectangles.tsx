/**
 * Componente AnimatedSocialRectangles
 * Orquesta la animación secuencial de rectángulos de redes sociales
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { SocialRectangle } from './SocialRectangle';
import type { AnimatedSocialRectanglesProps, AnimationState } from './types';
import { ANIMATION_CONFIG } from './constants';

/**
 * Componente que maneja la animación de múltiples rectángulos de redes sociales.
 * Controla la visibilidad secuencial y respeta las preferencias de accesibilidad.
 * 
 * @param platforms - Array de plataformas a animar
 * @param enableAnimation - Habilitar o deshabilitar animación (default: true)
 * 
 * @example
 * <AnimatedSocialRectangles 
 *   platforms={SOCIAL_PLATFORMS} 
 *   enableAnimation={true}
 * />
 */
export function AnimatedSocialRectangles({ 
  platforms,
  enableAnimation = true 
}: AnimatedSocialRectanglesProps) {
  // Inicializar estado de animación
  const [animationState, setAnimationState] = useState<AnimationState>({
    visibleRectangles: new Set(),
    currentStep: 0,
    isAnimating: true
  });
  
  // Ref para guardar preferencia de movimiento reducido
  const prefersReducedMotion = useRef(false);
  
  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar al montar
    checkMobile();
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    // Detectar preferencia de movimiento reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    
    if (mediaQuery.matches) {
      // Mostrar todos los rectángulos sin animación
      setAnimationState({
        visibleRectangles: new Set(platforms.map(p => p.id)),
        currentStep: 0,
        isAnimating: false
      });
      return;
    }
    
    if (!enableAnimation) return;
    
    // En móvil, mostrar máximo 3 rectángulos simultáneamente
    // En desktop, mostrar todos progresivamente
    const maxVisibleMobile = 3;
    
    // Calcular intervalo de animación
    const intervalDuration = ANIMATION_CONFIG.cycleDuration / platforms.length;
    
    // Iniciar secuencia de animación
    const animationInterval = setInterval(() => {
      setAnimationState(prev => {
        const nextStep = (prev.currentStep + 1) % platforms.length;
        const newVisible = new Set<string>();
        
        if (isMobile) {
          // En móvil: mostrar solo los últimos 3 rectángulos en la secuencia
          for (let i = 0; i < maxVisibleMobile; i++) {
            const index = (nextStep - i + platforms.length) % platforms.length;
            newVisible.add(platforms[index].id);
          }
        } else {
          // En desktop: mostrar todos los rectángulos hasta el paso actual
          platforms.forEach((platform, index) => {
            const shouldBeVisible = index <= nextStep;
            if (shouldBeVisible) {
              newVisible.add(platform.id);
            }
          });
        }
        
        return {
          ...prev,
          visibleRectangles: newVisible,
          currentStep: nextStep
        };
      });
    }, intervalDuration);
    
    // Limpiar interval en cleanup
    return () => clearInterval(animationInterval);
  }, [platforms, enableAnimation, isMobile]);
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {platforms.map(platform => (
        <SocialRectangle
          key={platform.id}
          platform={platform}
          isVisible={animationState.visibleRectangles.has(platform.id)}
        />
      ))}
    </div>
  );
}
