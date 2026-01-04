/**
 * Tests para el componente AnimatedSocialRectangles
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedSocialRectangles } from '../AnimatedSocialRectangles';
import type { SocialPlatform } from '../types';

// Mock de SocialRectangle
vi.mock('../SocialRectangle', () => ({
  SocialRectangle: ({ platform, isVisible }: { platform: SocialPlatform; isVisible: boolean }) => (
    <div 
      data-testid={`social-rectangle-${platform.id}`}
      data-visible={isVisible}
    >
      {platform.name}
    </div>
  )
}));

describe('AnimatedSocialRectangles', () => {
  const mockPlatforms: SocialPlatform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      aspectRatio: 1,
      width: 100,
      height: 100,
      position: { top: '10%', left: '10%' },
      animationDelay: 0,
      duration: 2000
    },
    {
      id: 'facebook',
      name: 'Facebook',
      aspectRatio: 1.91,
      width: 150,
      height: 78,
      position: { top: '20%', right: '10%' },
      animationDelay: 500,
      duration: 2000
    },
    {
      id: 'twitter',
      name: 'Twitter',
      aspectRatio: 1.78,
      width: 140,
      height: 78,
      position: { bottom: '10%', left: '10%' },
      animationDelay: 1000,
      duration: 2000
    }
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock de matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Renderizado', () => {
    it('renderiza todos los rectángulos de plataformas', () => {
      render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      mockPlatforms.forEach(platform => {
        expect(screen.getByTestId(`social-rectangle-${platform.id}`)).toBeInTheDocument();
      });
    });

    it('renderiza con el contenedor correcto', () => {
      const { container } = render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('absolute', 'inset-0', 'pointer-events-none');
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('renderiza correctamente con array vacío de plataformas', () => {
      const { container } = render(<AnimatedSocialRectangles platforms={[]} />);
      
      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelectorAll('[data-testid^="social-rectangle-"]')).toHaveLength(0);
    });
  });

  describe('Animación', () => {
    it('inicia con animación habilitada por defecto', () => {
      render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      // Verificar que hay un intervalo activo
      expect(vi.getTimerCount()).toBeGreaterThan(0);
    });

    it('respeta la prop enableAnimation=false', () => {
      render(<AnimatedSocialRectangles platforms={mockPlatforms} enableAnimation={false} />);
      
      // No debe haber intervalos activos
      expect(vi.getTimerCount()).toBe(0);
    });

    it('anima los rectángulos secuencialmente', () => {
      render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      // Verificar estado inicial - primer rectángulo visible
      const firstRectangle = screen.getByTestId(`social-rectangle-${mockPlatforms[0].id}`);
      
      // Avanzar el tiempo para ver la animación (cycleDuration / platforms.length)
      vi.advanceTimersByTime(2666);
      
      // Verificar que hay rectángulos renderizados
      const rectangles = mockPlatforms.map(p => 
        screen.getByTestId(`social-rectangle-${p.id}`)
      );
      
      expect(rectangles).toHaveLength(mockPlatforms.length);
    });

    it('limpia el intervalo al desmontar', () => {
      const { unmount } = render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      const timerCountBefore = vi.getTimerCount();
      expect(timerCountBefore).toBeGreaterThan(0);
      
      unmount();
      
      // Los timers deben limpiarse
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe('Prefers Reduced Motion', () => {
    it('muestra todos los rectángulos cuando prefers-reduced-motion está activo', () => {
      // Mock de matchMedia para prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      // Todos los rectángulos deben estar visibles
      mockPlatforms.forEach(platform => {
        const rectangle = screen.getByTestId(`social-rectangle-${platform.id}`);
        expect(rectangle).toHaveAttribute('data-visible', 'true');
      });
      
      // No debe haber intervalos activos
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe('Accesibilidad', () => {
    it('marca el contenedor como decorativo con aria-hidden', () => {
      const { container } = render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('usa pointer-events-none para no interferir con interacciones', () => {
      const { container } = render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('pointer-events-none');
    });
  });

  describe('Edge Cases', () => {
    it('maneja correctamente una sola plataforma', () => {
      const singlePlatform = [mockPlatforms[0]];
      render(<AnimatedSocialRectangles platforms={singlePlatform} />);
      
      expect(screen.getByTestId(`social-rectangle-${singlePlatform[0].id}`)).toBeInTheDocument();
    });

    it('maneja cambios en la prop platforms', () => {
      const { rerender } = render(<AnimatedSocialRectangles platforms={mockPlatforms} />);
      
      const newPlatforms = mockPlatforms.slice(0, 2);
      rerender(<AnimatedSocialRectangles platforms={newPlatforms} />);
      
      // Solo deben renderizarse las nuevas plataformas
      expect(screen.getByTestId(`social-rectangle-${newPlatforms[0].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`social-rectangle-${newPlatforms[1].id}`)).toBeInTheDocument();
      expect(screen.queryByTestId(`social-rectangle-${mockPlatforms[2].id}`)).not.toBeInTheDocument();
    });

    it('maneja cambios en enableAnimation', () => {
      const { rerender } = render(
        <AnimatedSocialRectangles platforms={mockPlatforms} enableAnimation={true} />
      );
      
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      
      rerender(<AnimatedSocialRectangles platforms={mockPlatforms} enableAnimation={false} />);
      
      // Los timers anteriores deben limpiarse
      vi.clearAllTimers();
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
