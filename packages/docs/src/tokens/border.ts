export const border = {
  // Border radius
  radius: {
    0: '0px',
    none: '0px',
    sm: '0.125rem', // 2px
    md: '0.25rem', // 4px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',

    // Component-specific radius
    button: {
      sm: '0.25rem', // 4px
      md: '0.375rem', // 6px
      lg: '0.5rem', // 8px
      xl: '0.75rem', // 12px
    },

    card: {
      sm: '0.5rem', // 8px
      md: '0.75rem', // 12px
      lg: '1rem', // 16px
      xl: '1.5rem', // 24px
    },

    input: {
      sm: '0.25rem', // 4px
      md: '0.375rem', // 6px
      lg: '0.5rem', // 8px
    },

    modal: '0.75rem', // 12px
    badge: '0.25rem', // 4px
    avatar: '50%',
  },

  // Border width
  width: {
    0: '0px',
    none: '0px',
    thin: '1px',
    sm: '1px',
    md: '2px',
    lg: '3px',
    xl: '4px',
    '2xl': '6px',
    '3xl': '8px',

    // Component-specific widths
    button: {
      default: '1px',
      focus: '2px',
    },

    input: {
      default: '1px',
      focus: '2px',
      error: '2px',
    },

    card: '1px',
    modal: '1px',
    divider: '1px',
  },

  // Border styles
  style: {
    none: 'none',
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    groove: 'groove',
    ridge: 'ridge',
    inset: 'inset',
    outset: 'outset',

    // Component-specific styles
    button: 'solid',
    input: 'solid',
    card: 'solid',
    modal: 'solid',
    divider: 'solid',
  },

  // Border color (references from color tokens)
  color: {
    default: 'var(--border-default)',
    secondary: 'var(--border-secondary)',
    focus: 'var(--border-focus)',
    error: 'var(--border-error)',
    success: 'var(--border-success)',
    warning: 'var(--border-warning)',
    info: 'var(--border-info)',

    // Component-specific colors
    button: {
      default: 'var(--border-default)',
      hover: 'var(--border-hover)',
      focus: 'var(--border-focus)',
      disabled: 'var(--border-disabled)',
    },

    input: {
      default: 'var(--border-default)',
      hover: 'var(--border-hover)',
      focus: 'var(--border-focus)',
      error: 'var(--border-error)',
      disabled: 'var(--border-disabled)',
    },
  },

  // Border utilities
  utilities: {
    // Common border combinations
    button: {
      default: '1px solid var(--border-default)',
      hover: '1px solid var(--border-hover)',
      focus: '2px solid var(--border-focus)',
      disabled: '1px solid var(--border-disabled)',
    },

    input: {
      default: '1px solid var(--border-default)',
      hover: '1px solid var(--border-hover)',
      focus: '2px solid var(--border-focus)',
      error: '2px solid var(--border-error)',
      disabled: '1px solid var(--border-disabled)',
    },

    card: '1px solid var(--border-default)',
    modal: '1px solid var(--border-default)',
    divider: '1px solid var(--border-secondary)',

    // Focus rings
    focusRing: {
      default: '0 0 0 2px var(--border-focus)',
      error: '0 0 0 2px var(--border-error)',
      success: '0 0 0 2px var(--border-success)',
      warning: '0 0 0 2px var(--border-warning)',
      info: '0 0 0 2px var(--border-info)',
    },
  },
} as const;

export type BorderToken = typeof border;
