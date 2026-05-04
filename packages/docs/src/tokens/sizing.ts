export const sizing = {
  // Base sizing units
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px

  // Semantic sizing
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem', // 72px
  '8xl': '6rem', // 96px
  '9xl': '8rem', // 128px

  // Component sizing
  button: {
    height: {
      sm: '2rem', // 32px
      md: '2.5rem', // 40px
      lg: '3rem', // 48px
      xl: '3.5rem', // 56px
    },
    minWidth: {
      sm: '4rem', // 64px
      md: '6rem', // 96px
      lg: '8rem', // 128px
      xl: '10rem', // 160px
    },
  },

  input: {
    height: {
      sm: '2rem', // 32px
      md: '2.5rem', // 40px
      lg: '3rem', // 48px
    },
    width: {
      sm: '12rem', // 192px
      md: '16rem', // 256px
      lg: '20rem', // 320px
      full: '100%',
    },
  },

  icon: {
    xs: '0.75rem', // 12px
    sm: '1rem', // 16px
    md: '1.25rem', // 20px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem', // 48px
  },

  avatar: {
    xs: '1.5rem', // 24px
    sm: '2rem', // 32px
    md: '2.5rem', // 40px
    lg: '3rem', // 48px
    xl: '4rem', // 64px
    '2xl': '5rem', // 80px
  },

  badge: {
    height: '1.25rem', // 20px
    minWidth: '1.25rem', // 20px
  },

  // Layout sizing
  layout: {
    header: {
      height: '4rem', // 64px
    },
    sidebar: {
      width: '16rem', // 256px
      collapsed: '4rem', // 64px
    },
    footer: {
      height: '3rem', // 48px
    },
    container: {
      maxWidth: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },

  // Viewport sizing
  viewport: {
    height: '100vh',
    width: '100vw',
    minHeight: '100vh',
    minWidth: '100vw',
  },

  // Percentage sizing
  percentage: {
    full: '100%',
    half: '50%',
    quarter: '25%',
    third: '33.333333%',
    twoThirds: '66.666667%',
  },
} as const;

export type SizingToken = typeof sizing;
