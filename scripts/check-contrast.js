/**
 * Script para verificar contraste de colores según WCAG AA
 * Ratio mínimo requerido: 4.5:1 para texto normal
 */

/**
 * Convierte un color hex a valores RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcula la luminancia relativa de un color
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula el ratio de contraste entre dos colores
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calcula el color resultante con opacidad sobre un fondo
 */
function applyOpacity(foreground, background, opacity) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) return background;
  
  const r = Math.round(fg.r * opacity + bg.r * (1 - opacity));
  const g = Math.round(fg.g * opacity + bg.g * (1 - opacity));
  const b = Math.round(fg.b * opacity + bg.b * (1 - opacity));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Colores de la paleta del proyecto
const COLORS = {
  brandBg: '#0A0028',
  brandDark: '#090040',
  brandPurple: '#B13BFF',
  white: '#FFFFFF'
};

console.log('=== Verificación de Contraste WCAG AA ===\n');
console.log('Ratio mínimo requerido: 4.5:1 para texto normal\n');

// 1. Verificar contraste del título (text-white sobre bg-brand-bg)
const titleContrast = getContrastRatio(COLORS.white, COLORS.brandBg);
console.log('1. Título Central:');
console.log(`   Color texto: ${COLORS.white} (white)`);
console.log(`   Color fondo: ${COLORS.brandBg} (brand-bg)`);
console.log(`   Ratio de contraste: ${titleContrast.toFixed(2)}:1`);
console.log(`   Estado: ${titleContrast >= 4.5 ? '✅ PASA WCAG AA' : '❌ NO PASA WCAG AA'}\n`);

// 2. Verificar contraste de etiquetas de rectángulos (text-white/80 sobre bg-brand-dark/30)
// Primero calculamos el color resultante de bg-brand-dark/30 sobre brand-bg
const rectangleBg = applyOpacity(COLORS.brandDark, COLORS.brandBg, 0.3);
// Luego calculamos el color resultante de white/80 sobre ese fondo
const rectangleText = applyOpacity(COLORS.white, rectangleBg, 0.8);
const labelContrast = getContrastRatio(rectangleText, rectangleBg);

console.log('2. Etiquetas de Rectángulos:');
console.log(`   Color texto: ${COLORS.white} con 80% opacidad (text-white/80)`);
console.log(`   Color fondo: ${COLORS.brandDark} con 30% opacidad sobre ${COLORS.brandBg} (bg-brand-dark/30)`);
console.log(`   Color texto resultante: ${rectangleText}`);
console.log(`   Color fondo resultante: ${rectangleBg}`);
console.log(`   Ratio de contraste: ${labelContrast.toFixed(2)}:1`);
console.log(`   Estado: ${labelContrast >= 4.5 ? '✅ PASA WCAG AA' : '❌ NO PASA WCAG AA'}\n`);

// Resumen
console.log('=== RESUMEN ===');
const allPass = titleContrast >= 4.5 && labelContrast >= 4.5;
if (allPass) {
  console.log('✅ Todos los contrastes cumplen con WCAG AA (4.5:1)');
} else {
  console.log('❌ Algunos contrastes NO cumplen con WCAG AA');
  console.log('\nRecomendaciones:');
  if (titleContrast < 4.5) {
    console.log('- Ajustar el color del título o del fondo');
  }
  if (labelContrast < 4.5) {
    console.log('- Aumentar la opacidad del texto de las etiquetas (ej: text-white/90 o text-white)');
    console.log('- Aumentar la opacidad del fondo de los rectángulos (ej: bg-brand-dark/50)');
  }
}

process.exit(allPass ? 0 : 1);
