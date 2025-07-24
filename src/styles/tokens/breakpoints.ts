export const breakpoints = {
  // Base breakpoints (mobile-first approach)
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',

  // Extended breakpoints
  xs: '475px',
  '3xl': '1920px',
  '4xl': '2560px',

  // Device-specific breakpoints
  mobile: {
    small: '320px',
    medium: '375px',
    large: '425px',
  },

  tablet: {
    small: '768px',
    medium: '834px',
    large: '1024px',
  },

  desktop: {
    small: '1280px',
    medium: '1440px',
    large: '1920px',
    ultrawide: '2560px',
  },

  // Orientation breakpoints
  orientation: {
    portrait: '(orientation: portrait)',
    landscape: '(orientation: landscape)',
  },

  // Feature-based breakpoints
  features: {
    hover: '(hover: hover)',
    noHover: '(hover: none)',
    pointer: '(pointer: fine)',
    coarse: '(pointer: coarse)',
    reducedMotion: '(prefers-reduced-motion: reduce)',
    darkMode: '(prefers-color-scheme: dark)',
    lightMode: '(prefers-color-scheme: light)',
  },

  // Container breakpoints (for max-width containers)
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },

  // Content breakpoints (for optimal reading)
  content: {
    narrow: '65ch',
    medium: '75ch',
    wide: '85ch',
    full: '100%',
  },

  // Grid breakpoints
  grid: {
    columns: {
      mobile: 4,
      tablet: 8,
      desktop: 12,
      wide: 16,
    },
    gap: {
      mobile: '1rem',
      tablet: '1.5rem',
      desktop: '2rem',
    },
  },

  // Navigation breakpoints
  navigation: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },

  // Sidebar breakpoints
  sidebar: {
    collapsed: '1024px',
    hidden: '768px',
  },

  // Modal breakpoints
  modal: {
    fullscreen: '640px',
    large: '1024px',
    medium: '768px',
    small: '480px',
  },

  // Typography breakpoints
  typography: {
    base: '16px',
    mobile: '14px',
    tablet: '16px',
    desktop: '18px',
  },

  // Spacing breakpoints
  spacing: {
    mobile: {
      container: '1rem',
      section: '2rem',
    },
    tablet: {
      container: '2rem',
      section: '3rem',
    },
    desktop: {
      container: '3rem',
      section: '4rem',
    },
  },
} as const;

export type BreakpointToken = typeof breakpoints;

// Utility functions for breakpoint usage
export const breakpointUtils = {
  // Media query helpers
  up: (breakpoint: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[breakpoint]})`,

  down: (breakpoint: keyof typeof breakpoints) =>
    `@media (max-width: ${breakpoints[breakpoint]})`,

  between: (min: keyof typeof breakpoints, max: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]})`,

  // Device-specific helpers
  mobile: `@media (max-width: ${breakpoints.md})`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`,

  // Feature-specific helpers
  hover: breakpoints.features.hover,
  noHover: breakpoints.features.noHover,
  reducedMotion: breakpoints.features.reducedMotion,
  darkMode: breakpoints.features.darkMode,
  lightMode: breakpoints.features.lightMode,
} as const;
