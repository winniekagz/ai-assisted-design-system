export const typography = {
  // Font families
  fontFamily: {
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
    mono: 'var(--font-mono)',
    rubik: 'var(--font-rubik)',
  },

  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Font sizes
  fontSize: {
    // Base sizes
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
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

    // Custom sizes from specifications
    pageHeader: '6em', // 96px
    h1: '75px',
    h1Mobile: '60px',
    h2: '50px',
    h2Mobile: '30px',
    h3: '30px',
    h3Mobile: '24px',
    h4: '21px',
    h5: '1.5em', // 24px
    h6: '1.25rem', // 20px
    buttonLarge: '26px',
    body1: '1rem', // 16px
    body2: '0.87rem', // 14px
    link: '16px',
    caption: '14px',
    smallText: '14px',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',

    // Custom line heights from specifications
    pageHeader: '100%',
    h1: '100%',
    h2: '100%',
    h3: '100%',
    h4: '120%',
    h5: '133%',
    h6: '160%',
    buttonLarge: '0.46',
    body1: '150%',
    body2: '143%',
    link: '130%',
    caption: '100%',
    smallText: '130%',
    paragraph: '130%',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',

    // Custom letter spacing from specifications
    pageHeader: '1.5px',
    h1: '-2px',
    h1Mobile: '-5%',
    h2: '-3%',
    h2Mobile: '-2px',
    h3: '-2px',
    h3Mobile: '-3px',
    h4: '0px',
    h4Mobile: '-3%',
    h5: '0.5%',
    h6: '0.15px',
    body1: '0.15%',
    body2: '0.17%',
    link: '15px',
    caption: '0px',
    smallText: '0px',
  },

  // Vertical alignment
  verticalAlign: {
    pageHeader: 'middle',
    h1: 'middle',
    h2: 'baseline',
    h3: 'baseline',
    h4: 'baseline',
    h5: 'baseline',
    h6: 'baseline',
  },

  // Typography presets
  presets: {
    pageHeader: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '6em',
      fontWeight: '500',
      lineHeight: '100%',
      letterSpacing: '1.5px',
      color: 'var(--neutral-300)',
      verticalAlign: 'middle',
    },

    h1: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '75px',
      fontWeight: '500',
      lineHeight: '100%',
      letterSpacing: '-2px',
      verticalAlign: 'middle',
      mobile: {
        fontSize: '60px',
        letterSpacing: '-5%',
      },
    },

    h2: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '50px',
      fontWeight: '500',
      lineHeight: '100%',
      letterSpacing: '-3%',
      mobile: {
        fontSize: '30px',
        letterSpacing: '-2px',
      },
    },

    h3: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '30px',
      fontWeight: '500',
      lineHeight: '100%',
      letterSpacing: '-2px',
      mobile: {
        fontSize: '24px',
        letterSpacing: '-3px',
      },
    },

    h4: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '21px',
      fontWeight: '500',
      lineHeight: '120%',
      letterSpacing: '0px',
      mobile: {
        letterSpacing: '-3%',
      },
    },

    h5: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '1.5em',
      fontWeight: '500',
      lineHeight: '133%',
      letterSpacing: '0.5%',
    },

    h6: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: '160%',
      letterSpacing: '0.15px',
    },

    buttonLarge: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '26px',
      fontWeight: '500',
      lineHeight: '0.46',
    },

    body1: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '150%',
      letterSpacing: '0.15%',
    },

    body2: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '0.87rem',
      fontWeight: '400',
      lineHeight: '143%',
      letterSpacing: '0.17%',
    },

    link: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '130%',
      letterSpacing: '15px',
    },

    caption: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '100%',
      letterSpacing: '0px',
    },

    smallText: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '130%',
      letterSpacing: '0px',
    },

    paragraph: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '130%',
      letterSpacing: '0px',
    },
  },

  // Responsive typography
  responsive: {
    mobile: {
      h1: {
        fontSize: '60px',
        letterSpacing: '-5%',
      },
      h2: {
        fontSize: '30px',
        letterSpacing: '-2px',
      },
      h3: {
        fontSize: '24px',
        letterSpacing: '-3px',
      },
      h4: {
        letterSpacing: '-3%',
      },
    },
    tablet: {
      h1: {
        fontSize: '67px',
      },
      h2: {
        fontSize: '40px',
      },
      h3: {
        fontSize: '27px',
      },
    },
    desktop: {
      h1: {
        fontSize: '75px',
      },
      h2: {
        fontSize: '50px',
      },
      h3: {
        fontSize: '30px',
      },
    },
  },

  // Component-specific typography
  components: {
    button: {
      large: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '26px',
        fontWeight: '500',
        lineHeight: '0.46',
        letterSpacing: '0px',
      },
      medium: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '16px',
        fontWeight: '500',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },
      small: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },
    },

    input: {
      default: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },
      small: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },
    },

    label: {
      default: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },
      small: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },
    },

    badge: {
      default: {
        fontFamily: 'var(--font-rubik)',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },
    },

    tooltip: {
      fontFamily: 'var(--font-rubik)',
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0px',
    },
  },
} as const;

export type TypographyToken = typeof typography;
