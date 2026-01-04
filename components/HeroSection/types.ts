/**
 * Tipos y interfaces para el componente HeroSection
 */

/**
 * Representa una plataforma de red social con sus características visuales y de animación
 */
export interface SocialPlatform {
  /** Identificador único de la plataforma */
  id: string;
  /** Nombre de la plataforma */
  name: string;
  /** Proporción de aspecto (width/height) */
  aspectRatio: number;
  /** Ancho en píxeles base */
  width: number;
  /** Alto en píxeles base */
  height: number;
  /** Posición absoluta del rectángulo */
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  /** Delay de animación en milisegundos */
  animationDelay: number;
  /** Duración visible en milisegundos */
  duration: number;
}

/**
 * Estado de la animación de rectángulos
 */
export interface AnimationState {
  /** Set de IDs de rectángulos visibles */
  visibleRectangles: Set<string>;
  /** Paso actual en la secuencia de animación */
  currentStep: number;
  /** Indica si la animación está activa */
  isAnimating: boolean;
}

/**
 * Props para el componente HeroTitle
 */
export interface HeroTitleProps {
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Props para el componente AnimatedSocialRectangles
 */
export interface AnimatedSocialRectanglesProps {
  /** Array de plataformas a mostrar */
  platforms: SocialPlatform[];
  /** Habilitar o deshabilitar animación */
  enableAnimation?: boolean;
}

/**
 * Props para el componente SocialRectangle
 */
export interface SocialRectangleProps {
  /** Plataforma a renderizar */
  platform: SocialPlatform;
  /** Estado de visibilidad del rectángulo */
  isVisible: boolean;
}
