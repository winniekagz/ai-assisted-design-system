export const opacity = {
  // Base opacity values
  base: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
  },

  // Semantic opacity values
  semantic: {
    disabled: '0.5',
    disabledText: '0.38',
    overlay: '0.5',
    backdrop: '0.8',
    ghost: '0.1',
    subtle: '0.05',
    medium: '0.3',
    strong: '0.7',
  },

  // Component-specific opacity
  component: {
    button: {
      disabled: '0.5',
      loading: '0.7',
      ghost: '0.1',
      hover: '0.9',
    },

    input: {
      disabled: '0.5',
      placeholder: '0.6',
      focus: '1',
    },

    card: {
      hover: '0.95',
      disabled: '0.7',
    },

    modal: {
      backdrop: '0.8',
      overlay: '0.5',
    },

    tooltip: {
      background: '0.9',
    },

    badge: {
      ghost: '0.1',
      subtle: '0.05',
    },

    avatar: {
      fallback: '0.3',
    },
  },

  // Interactive states
  states: {
    hover: {
      light: '0.8',
      medium: '0.9',
      strong: '0.95',
    },

    active: {
      default: '0.7',
      pressed: '0.5',
    },

    focus: {
      ring: '0.1',
      outline: '0.2',
    },

    disabled: {
      element: '0.5',
      text: '0.38',
      icon: '0.3',
    },

    loading: {
      default: '0.7',
      skeleton: '0.1',
    },
  },

  // Overlay and backdrop
  overlay: {
    light: '0.1',
    medium: '0.3',
    heavy: '0.5',
    backdrop: '0.8',
    modal: '0.5',
    tooltip: '0.9',
    dropdown: '0.95',
  },

  // Text opacity
  text: {
    primary: '0.87',
    secondary: '0.6',
    disabled: '0.38',
    placeholder: '0.6',
    muted: '0.5',
    subtle: '0.3',
  },

  // Background opacity
  background: {
    subtle: '0.05',
    ghost: '0.1',
    overlay: '0.5',
    backdrop: '0.8',
    modal: '0.9',
  },

  // Border opacity
  border: {
    subtle: '0.1',
    default: '0.2',
    strong: '0.3',
    focus: '0.5',
  },

  // Shadow opacity (for elevation)
  shadow: {
    light: '0.05',
    medium: '0.1',
    heavy: '0.2',
    darkest: '0.3',
  },
} as const;

export type OpacityToken = typeof opacity;
