/**
 * Frametale Design System
 * Brand colors from logo gradient
 */

export const colors = {
  // Primary brand gradient (from logo)
  brand: {
    teal: '#28BAAB',
    blue: '#0376AD',
    gradient: 'linear-gradient(135deg, #28BAAB 0%, #0376AD 100%)',
  },
  
  // Neutrals
  neutral: {
    50: '#FAFAF8',
    100: '#F5F2ED',
    200: '#EBE6DD',
    300: '#DDD6C8',
    400: '#C9BFA9',
    500: '#8A8279',
    600: '#534C43',
    700: '#2C2825',
    800: '#1A1612',
    900: '#000000',
  },
  
  // Functional
  success: '#2D6A4F',
  error: '#C1666B',
  warning: '#D4A574',
  info: '#0376AD',
}

export const typography = {
  serif: {
    family: 'var(--font-serif)',
    weights: { light: 300, normal: 400, medium: 500 }
  },
  sans: {
    family: 'var(--font-sans)',
    weights: { normal: 400, medium: 500, semibold: 600, bold: 700 }
  },
}

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
}

export const radius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
}
