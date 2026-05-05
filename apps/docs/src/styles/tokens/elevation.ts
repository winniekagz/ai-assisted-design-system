export const elevation = {
  // Base shadow values
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    material: {
      1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    },
  },

  // Component-specific elevations
  component: {
    button: {
      default: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      hover:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      active: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      disabled: 'none',
    },

    card: {
      default:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      hover:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      elevated:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    modal: {
      backdrop: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      content:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    dropdown: {
      menu: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },

    tooltip: {
      default:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },

    input: {
      default: 'none',
      focus: '0 0 0 3px rgba(0, 153, 102, 0.1)',
      error: '0 0 0 3px rgba(211, 47, 47, 0.1)',
    },

    badge: {
      default: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },

    avatar: {
      default: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
  },

  // Layout elevations
  layout: {
    header: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    sidebar: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    footer: '0 -1px 3px rgba(0,0,0,0.12), 0 -1px 2px rgba(0,0,0,0.24)',
    navigation: '0 2px 4px rgba(0,0,0,0.1)',
  },

  // Interactive states
  states: {
    focus: {
      default: '0 0 0 3px rgba(0, 153, 102, 0.1)',
      error: '0 0 0 3px rgba(211, 47, 47, 0.1)',
      success: '0 0 0 3px rgba(46, 125, 50, 0.1)',
      warning: '0 0 0 3px rgba(239, 108, 0, 0.1)',
      info: '0 0 0 3px rgba(2, 136, 209, 0.1)',
    },

    hover: {
      light:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      medium:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      heavy:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    active: {
      default: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },

    disabled: {
      default: 'none',
    },
  },

  // Dark mode adjustments
  dark: {
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.6)',
    },
  },
} as const;

export type ElevationToken = typeof elevation;
