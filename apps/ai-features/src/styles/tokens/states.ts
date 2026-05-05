export const states = {
  // Interactive states
  interactive: {
    hover: {
      opacity: '0.9',
      transform: 'translateY(-1px)',
      shadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      scale: '1.02',
    },

    active: {
      opacity: '0.8',
      transform: 'translateY(0px)',
      scale: '0.98',
    },

    focus: {
      outline: '1px solid var(--border-focus)',
      outlineOffset: '2px',
      ring: '0 0 0 1px rgba(0, 153, 102, 0.1)',
    },

    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },

    loading: {
      opacity: '0.7',
      cursor: 'wait',
      pointerEvents: 'none',
    },
  },

  // Component-specific states
  component: {
    button: {
      default: {
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      },

      hover: {
        backgroundColor: 'var(--button-hover-bg)',
        borderColor: 'var(--button-hover-border)',
        transform: 'translateY(-1px)',
        shadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },

      active: {
        backgroundColor: 'var(--button-active-bg)',
        borderColor: 'var(--button-active-border)',
        transform: 'translateY(0px)',
        shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },

      focus: {
        outline: 'none',
        ring: '0 0 0 3px rgba(0, 153, 102, 0.1)',
        borderColor: 'var(--border-focus)',
      },

      disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
        backgroundColor: 'var(--button-disabled-bg)',
        borderColor: 'var(--button-disabled-border)',
        color: 'var(--button-disabled-text)',
      },

      loading: {
        cursor: 'wait',
        opacity: '0.7',
      },
    },

    input: {
      default: {
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--background-paper)',
        transition:
          'border-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      },

      hover: {
        borderColor: 'var(--border-hover)',
      },

      focus: {
        borderColor: 'var(--border-focus)',
        ring: '0 0 0 3px rgba(0, 153, 102, 0.1)',
        outline: 'none',
      },

      error: {
        borderColor: 'var(--border-error)',
        ring: '0 0 0 3px rgba(211, 47, 47, 0.1)',
      },

      disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
        backgroundColor: 'var(--background-disabled)',
        borderColor: 'var(--border-disabled)',
      },
    },

    card: {
      default: {
        backgroundColor: 'var(--background-paper)',
        borderColor: 'var(--border-default)',
        transition:
          'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      },

      hover: {
        transform: 'translateY(-2px)',
        shadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },

      active: {
        transform: 'translateY(0px)',
        shadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },

      disabled: {
        opacity: '0.7',
        cursor: 'not-allowed',
      },
    },

    link: {
      default: {
        color: 'var(--text-primary)',
        textDecoration: 'none',
        transition: 'color 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      },

      hover: {
        color: 'var(--primary-600)',
        textDecoration: 'underline',
      },

      active: {
        color: 'var(--primary-700)',
      },

      focus: {
        outline: '2px solid var(--border-focus)',
        outlineOffset: '2px',
      },

      disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  },

  // Form states
  form: {
    valid: {
      borderColor: 'var(--success-500)',
      ring: '0 0 0 3px rgba(46, 125, 50, 0.1)',
    },

    invalid: {
      borderColor: 'var(--error-500)',
      ring: '0 0 0 3px rgba(211, 47, 47, 0.1)',
    },

    required: {
      '::after': {
        content: '"*"',
        color: 'var(--error-500)',
        marginLeft: '0.25rem',
      },
    },
  },

  // Loading states
  loading: {
    skeleton: {
      backgroundColor: 'var(--background-secondary)',
      backgroundImage:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s linear infinite',
    },

    spinner: {
      animation: 'spin 1s linear infinite',
    },

    pulse: {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
  },

  // Selection states
  selection: {
    default: {
      backgroundColor: 'var(--primary-200)',
      color: 'var(--text-primary)',
    },

    disabled: {
      backgroundColor: 'var(--background-disabled)',
      color: 'var(--text-disabled)',
    },
  },

  // Drag and drop states
  drag: {
    dragging: {
      opacity: '0.5',
      transform: 'rotate(5deg)',
      zIndex: '1000',
    },

    dragOver: {
      backgroundColor: 'var(--primary-50)',
      borderColor: 'var(--primary-500)',
      borderStyle: 'dashed',
    },

    dragEnter: {
      backgroundColor: 'var(--primary-100)',
    },

    dragLeave: {
      backgroundColor: 'transparent',
    },
  },

  // Expandable states
  expandable: {
    expanded: {
      transform: 'rotate(180deg)',
      transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },

    collapsed: {
      transform: 'rotate(0deg)',
      transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
  },

  // Toggle states
  toggle: {
    on: {
      backgroundColor: 'var(--primary-500)',
      borderColor: 'var(--primary-500)',
    },

    off: {
      backgroundColor: 'var(--background-paper)',
      borderColor: 'var(--border-default)',
    },

    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },

  // Checkbox and radio states
  inputControl: {
    checked: {
      backgroundColor: 'var(--primary-500)',
      borderColor: 'var(--primary-500)',
      color: 'var(--primary-contrast-text)',
    },

    unchecked: {
      backgroundColor: 'var(--background-paper)',
      borderColor: 'var(--border-default)',
    },

    indeterminate: {
      backgroundColor: 'var(--primary-300)',
      borderColor: 'var(--primary-300)',
    },

    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
} as const;

export type StatesToken = typeof states;
