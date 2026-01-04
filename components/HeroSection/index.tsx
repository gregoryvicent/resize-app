/**
 * Componente HeroSection
 * Sección principal de presentación con título y animaciones de redes sociales
 */

'use client';

import { HeroTitle } from './HeroTitle';
import { AnimatedSocialRectangles } from './AnimatedSocialRectangles';
import { SOCIAL_PLATFORMS } from './constants';

export function HeroSection() {
  return (
    <section 
      className="relative w-full h-screen bg-brand-bg overflow-hidden flex items-center justify-center"
      aria-label="Hero section"
    >
      {/* Efecto de viñeta - oscurece los bordes */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.6) 100%)'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center">
        <HeroTitle />
        
        {/* Flecha animada hacia abajo */}
        <div 
          className="mt-12 md:mt-16 animate-bounce cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll to upload section"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }
          }}
        >
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-white/60 hover:text-brand-purple transition-colors duration-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
      
      <AnimatedSocialRectangles platforms={SOCIAL_PLATFORMS} />
    </section>
  );
}
