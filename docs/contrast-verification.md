# Verificación de Contraste WCAG AA

## Requisito
Ratio mínimo de contraste: **4.5:1** para texto normal según WCAG AA

## Colores de la Paleta

```
#0A0028 (brand-bg)        → Background general
#090040 (brand-dark)      → Fondos oscuros
#B13BFF (brand-purple)    → Elementos interactivos
#FFFFFF (white)           → Texto
```

## Cálculos de Contraste

### 1. Título Central
- **Texto**: `#FFFFFF` (white) con clase `text-white`
- **Fondo**: `#0A0028` (brand-bg) con clase `bg-brand-bg`

**Cálculo de luminancia relativa:**
- Luminancia de #FFFFFF: 1.0
- Luminancia de #0A0028: 0.00247

**Ratio de contraste:**
```
(1.0 + 0.05) / (0.00247 + 0.05) = 1.05 / 0.05247 = 20.01:1
```

✅ **PASA WCAG AA** (20.01:1 > 4.5:1)

### 2. Etiquetas de Rectángulos
- **Texto**: `#FFFFFF` con 80% opacidad (`text-white/80`)
- **Fondo**: `#090040` con 30% opacidad sobre `#0A0028` (`bg-brand-dark/30`)

**Cálculo del color de fondo resultante:**
```
R = 9 * 0.3 + 10 * 0.7 = 2.7 + 7.0 = 9.7 ≈ 10
G = 0 * 0.3 + 0 * 0.7 = 0
B = 64 * 0.3 + 40 * 0.7 = 19.2 + 28.0 = 47.2 ≈ 47
Fondo resultante: #0A002F
```

**Cálculo del color de texto resultante:**
```
R = 255 * 0.8 + 10 * 0.2 = 204 + 2 = 206
G = 255 * 0.8 + 0 * 0.2 = 204
B = 255 * 0.8 + 47 * 0.2 = 204 + 9.4 = 213.4 ≈ 213
Texto resultante: #CECC D5
```

**Luminancias:**
- Luminancia de #CECCD5: ~0.65
- Luminancia de #0A002F: ~0.0025

**Ratio de contraste:**
```
(0.65 + 0.05) / (0.0025 + 0.05) = 0.70 / 0.0525 = 13.33:1
```

✅ **PASA WCAG AA** (13.33:1 > 4.5:1)

## Resumen

| Elemento | Contraste | Estado |
|----------|-----------|--------|
| Título Central | 20.01:1 | ✅ PASA |
| Etiquetas de Rectángulos | 13.33:1 | ✅ PASA |

**Conclusión**: Todos los elementos de texto cumplen con WCAG AA (4.5:1 mínimo).

## Verificación en Código

Los colores están correctamente aplicados en:

1. **HeroTitle.tsx**: 
   - `text-white` sobre `bg-brand-bg` (del contenedor padre)
   
2. **SocialRectangle.tsx**:
   - `text-white/80` sobre `bg-brand-dark/30`
   - El fondo tiene `backdrop-blur-sm` que puede mejorar aún más la legibilidad

## Recomendaciones

✅ No se requieren ajustes. Los contrastes actuales superan ampliamente el mínimo de WCAG AA.

**Nota**: El contraste del título (20:1) incluso cumple con WCAG AAA (7:1), lo que proporciona excelente accesibilidad.
