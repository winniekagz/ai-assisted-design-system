import type { ComponentIqTokens } from './tokens';

export const defaultComponentIqTokens: ComponentIqTokens = {
  colors: {
    primary: '#8D493A',
    primaryForeground: '#FDFAF9',
    primaryScale: {
      50: '#F8EDE3',
      100: '#EDDDD2',
      200: '#D9B8A6',
      300: '#BC8A76',
      400: '#A56855',
      500: '#8D493A',
      600: '#7A3F33',
      700: '#66352B',
      800: '#4D271F',
      900: '#331812',
      950: '#1A0C09',
    },
    secondary: '#347887',
    secondaryForeground: '#FDFAF9',
    secondaryScale: {
      50: '#EEF9FB',
      100: '#D7F0F4',
      200: '#B2E0E8',
      300: '#82CAD7',
      400: '#58AEBD',
      500: '#347887',
      600: '#2F6F7D',
      700: '#285D68',
      800: '#214B54',
      900: '#1C3E45',
      950: '#0D2025',
    },
    background: '#FDFAF9',
    surface: '#FFFFFF',
    secondaryBackground: '#F9FAFB',
    hover: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    textDisabled: '#9CA3AF',
    foreground: '#374151',
    title: '#111827',
    muted: '#6B7280',
    inverse: '#FDFAF9',
    border: '#D1D5DB',
    borderSubtle: '#E5E7EB',
    focus: '#8D493A',
    error: '#B42318',
    errorPastel: '#FEF3F2',
    warning: '#B54708',
    warningPastel: '#FFF4E5',
    success: '#067647',
    successPastel: '#ECFDF3',
    information: '#175CD3',
    informationPastel: '#EFF8FF',
    link: '#175CD3',
    linkPastel: '#EFF8FF',
    destructive: '#B42318',
    info: '#175CD3',
  },
  typography: {
    fontFamily:
      "'Rubik', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    headingFontFamily:
      "'Rubik', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    monoFontFamily:
      "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
    baseSize: '1rem',
    bodySize: '1rem',
    bodySmallSize: '0.875rem',
    captionSize: '0.75rem',
    labelSize: '0.875rem',
    largeFontSize: '1.125rem',
    heading1Size: '4rem',
    heading2Size: '3rem',
    heading3Size: '2.25rem',
    heading4Size: '1.75rem',
    heading5Size: '1.375rem',
    heading6Size: '1rem',
    display1Size: '3.75rem',
    display2Size: '3rem',
    display3Size: '2.25rem',
    headingWeight: 700,
    bodyWeight: 400,
    mediumWeight: 500,
    lineHeightNormal: 1.5,
    lineHeightSnug: 1.375,
    lineHeightBody: 1.5,
  },
radius: {
  xs: '0.125rem', // 2px
  sm: '0.25rem',  // 4px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  full: '9999px',
},
  spacing: {
  xs: '0.25rem',   // 4
  sm: '0.5rem',    // 8
  md: '1rem',      // 16
  lg: '1.5rem',    // 24
  xl: '2rem',      // 32
  '2xl': '3rem',   // 48
},
  shadows: {
    sm: '0 1px 2px rgb(0 0 0 / 0.05)',
    md: '0 4px 12px rgb(0 0 0 / 0.08)',
    lg: '0 10px 30px rgb(0 0 0 / 0.12)',
  },
  strokeWidth: {
    hairline: '0.5px',
    thin: '1px',
    md: '1.5px',
    lg: '2px',
  },
  motion: {
    fast: '120ms',
    normal: '200ms',
    slow: '320ms',
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  zIndex: {
    base: 0,
    dropdown: 50,
    sticky: 100,
    overlay: 200,
    modal: 300,
    toast: 400,
  },
};
