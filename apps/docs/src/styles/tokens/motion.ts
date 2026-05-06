export const motion = {
  // Duration values
  duration: {
    instant: '0ms',
    fast: '100ms',
    quick: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '700ms',

    // Component-specific durations
    button: {
      hover: '150ms',
      active: '100ms',
      focus: '200ms',
    },

    input: {
      focus: '200ms',
      error: '300ms',
    },

    modal: {
      enter: '300ms',
      exit: '200ms',
    },

    dropdown: {
      enter: '200ms',
      exit: '150ms',
    },

    tooltip: {
      enter: '200ms',
      exit: '150ms',
    },

    accordion: {
      expand: '300ms',
      collapse: '200ms',
    },

    skeleton: {
      pulse: '1500ms',
      shimmer: '2000ms',
    },
  },

  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Material Design easing
    material: {
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      deceleration: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      acceleration: 'cubic-bezier(0.4, 0.0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
    },

    // Custom easing curves
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

    // Component-specific easing
    button: {
      hover: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      active: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
    },

    modal: {
      enter: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
    },
  },

  // Transition definitions
  transition: {
    // Base transitions
    all: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    colors:
      'color 200ms cubic-bezier(0.4, 0.0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',

    // Component-specific transitions
    button: {
      default: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      hover: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      active: 'all 100ms cubic-bezier(0.4, 0.0, 0.6, 1)',
      focus: 'box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },

    input: {
      default:
        'border-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      focus:
        'border-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      error: 'border-color 300ms cubic-bezier(0.4, 0.0, 0.6, 1)',
    },

    card: {
      hover:
        'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },

    modal: {
      backdrop: 'opacity 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      content:
        'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },

    dropdown: {
      menu: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },

    tooltip: {
      default:
        'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
  },

  // Animation keyframes
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },

    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },

    slideInUp: {
      '0%': { transform: 'translateY(100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },

    slideInDown: {
      '0%': { transform: 'translateY(-100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },

    slideInLeft: {
      '0%': { transform: 'translateX(-100%)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },

    slideInRight: {
      '0%': { transform: 'translateX(100%)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },

    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },

    scaleOut: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '100%': { transform: 'scale(0.95)', opacity: '0' },
    },

    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },

    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },

    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },

    bounce: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
      '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
      '70%': { transform: 'translate3d(0, -15px, 0)' },
      '90%': { transform: 'translate3d(0, -4px, 0)' },
    },
  },

  // Animation utilities
  animation: {
    fadeIn: 'fadeIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    fadeOut: 'fadeOut 200ms cubic-bezier(0.4, 0.0, 0.6, 1)',
    slideInUp: 'slideInUp 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    slideInDown: 'slideInDown 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    slideInLeft: 'slideInLeft 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    slideInRight: 'slideInRight 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    scaleIn: 'scaleIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    scaleOut: 'scaleOut 200ms cubic-bezier(0.4, 0.0, 0.6, 1)',
    spin: 'spin 1s linear infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    shimmer: 'shimmer 2s linear infinite',
    bounce: 'bounce 1s ease-in-out infinite',
  },
} as const;

export type MotionToken = typeof motion;
