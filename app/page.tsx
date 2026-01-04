/**
 * Página principal de la aplicación Resize Images.
 * Muestra la sección Hero animada y la interfaz de carga de imágenes.
 */

'use client';

import { HeroSection } from '@/components/HeroSection';
import { ImageUploader } from '@/components/ImageUploader';

export default function Home() {
  // Callback cuando el usuario selecciona un archivo
  const handleFileSelect = (file: File) => {
    console.log('Archivo seleccionado:', file.name);
    // TODO: En futuras fases, aquí se procesará la imagen
  };

  return (
    <div className="min-h-screen">
      {/* Sección Hero con título y animaciones */}
      <HeroSection />
      
      {/* Sección de carga de imágenes */}
      <main className="relative w-full h-screen flex items-center justify-center px-4 md:px-8">
        {/* Efecto de viñeta - oscurece los bordes */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.6) 100%)'
          }}
        />
        
        <div className="relative z-10 w-full max-w-4xl">
          <ImageUploader onFileSelect={handleFileSelect} />
        </div>
      </main>
    </div>
  );
}
