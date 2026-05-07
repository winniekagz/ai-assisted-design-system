import { BadgeVariants } from '../../../types/badgw';

export type BadgeVariantName = 'filled' | 'outlined' | 'pastel';
export type BadgeColorStyle = {
  backgroundColor: string;
  borderColor?: string;
  color: string;
};

const statusColorClasses = {
  success: {
    filled:
      'bg-[color:var(--helper-success,#067647)] text-[color:var(--text-inverse,#ffffff)]',
    outlined:
      'bg-transparent text-[color:var(--helper-success,#067647)] border-[color:var(--helper-success,#067647)]',
    pastel:
      'bg-[color:var(--helper-success-pastel,#ECFDF3)] text-[color:var(--helper-success,#067647)]',
  },
  warning: {
    filled:
      'bg-[color:var(--helper-warning,#B54708)] text-[color:var(--text-inverse,#ffffff)]',
    outlined:
      'bg-transparent text-[color:var(--helper-warning,#B54708)] border-[color:var(--helper-warning,#B54708)]',
    pastel:
      'bg-[color:var(--helper-warning-pastel,#FFF4E5)] text-[color:var(--helper-warning,#B54708)]',
  },
  error: {
    filled:
      'bg-[color:var(--helper-error,#B42318)] text-[color:var(--text-inverse,#ffffff)]',
    outlined:
      'bg-transparent text-[color:var(--helper-error,#B42318)] border-[color:var(--helper-error,#B42318)]',
    pastel:
      'bg-[color:var(--helper-error-pastel,#FEF3F2)] text-[color:var(--helper-error,#B42318)]',
  },
  info: {
    filled:
      'bg-[color:var(--helper-information,#175CD3)] text-[color:var(--text-inverse,#ffffff)]',
    outlined:
      'bg-transparent text-[color:var(--helper-information,#175CD3)] border-[color:var(--helper-information,#175CD3)]',
    pastel:
      'bg-[color:var(--helper-information-pastel,#EFF8FF)] text-[color:var(--helper-information,#175CD3)]',
  },
  link: {
    filled:
      'bg-[color:var(--helper-link,#0284C7)] text-[color:var(--text-inverse,#ffffff)]',
    outlined:
      'bg-transparent text-[color:var(--helper-link,#0284C7)] border-[color:var(--helper-link,#0284C7)]',
    pastel:
      'bg-[color:var(--helper-link-pastel,#E0F2FE)] text-[color:var(--helper-link,#0284C7)]',
  },
  neutral: {
    filled:
      'bg-[color:var(--bg-secondary,#F3F4F6)] text-[color:var(--text-secondary,#374151)]',
    outlined:
      'bg-transparent text-[color:var(--text-secondary,#374151)] border-[color:var(--border-default,var(--border-subtle,#D1D5DB))]',
    pastel:
      'bg-[color:var(--bg-secondary,#F3F4F6)] text-[color:var(--text-secondary,#374151)]',
  },
} satisfies Record<string, BadgeVariants>;

type StatusColorKey = keyof typeof statusColorClasses;

const statusColorStyles: Record<
  StatusColorKey,
  Record<BadgeVariantName, BadgeColorStyle>
> = {
  success: {
    filled: {
      backgroundColor: 'var(--helper-success,#067647)',
      borderColor: 'var(--helper-success,#067647)',
      color: 'var(--text-inverse,#ffffff)',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--helper-success,#067647)',
      color: 'var(--helper-success,#067647)',
    },
    pastel: {
      backgroundColor: 'var(--helper-success-pastel,#ECFDF3)',
      borderColor: 'var(--helper-success,#067647)',
      color: 'var(--helper-success,#067647)',
    },
  },
  warning: {
    filled: {
      backgroundColor: 'var(--helper-warning,#B54708)',
      borderColor: 'var(--helper-warning,#B54708)',
      color: 'var(--text-inverse,#ffffff)',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--helper-warning,#B54708)',
      color: 'var(--helper-warning,#B54708)',
    },
    pastel: {
      backgroundColor: 'var(--helper-warning-pastel,#FFF4E5)',
      borderColor: 'var(--helper-warning,#B54708)',
      color: 'var(--helper-warning,#B54708)',
    },
  },
  error: {
    filled: {
      backgroundColor: 'var(--helper-error,#B42318)',
      borderColor: 'var(--helper-error,#B42318)',
      color: 'var(--text-inverse,#ffffff)',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--helper-error,#B42318)',
      color: 'var(--helper-error,#B42318)',
    },
    pastel: {
      backgroundColor: 'var(--helper-error-pastel,#FEF3F2)',
      borderColor: 'var(--helper-error,#B42318)',
      color: 'var(--helper-error,#B42318)',
    },
  },
  info: {
    filled: {
      backgroundColor: 'var(--helper-information,#175CD3)',
      borderColor: 'var(--helper-information,#175CD3)',
      color: 'var(--text-inverse,#ffffff)',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--helper-information,#175CD3)',
      color: 'var(--helper-information,#175CD3)',
    },
    pastel: {
      backgroundColor: 'var(--helper-information-pastel,#EFF8FF)',
      borderColor: 'var(--helper-information,#175CD3)',
      color: 'var(--helper-information,#175CD3)',
    },
  },
  link: {
    filled: {
      backgroundColor: 'var(--helper-link,#0284C7)',
      borderColor: 'var(--helper-link,#0284C7)',
      color: 'var(--text-inverse,#ffffff)',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--helper-link,#0284C7)',
      color: 'var(--helper-link,#0284C7)',
    },
    pastel: {
      backgroundColor: 'var(--helper-link-pastel,#E0F2FE)',
      borderColor: 'var(--helper-link,#0284C7)',
      color: 'var(--helper-link,#0284C7)',
    },
  },
  neutral: {
    filled: {
      backgroundColor: 'var(--bg-secondary,#F3F4F6)',
      borderColor: 'var(--border-default,var(--border-subtle,#D1D5DB))',
      color: 'var(--text-secondary,#374151)',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--border-default,var(--border-subtle,#D1D5DB))',
      color: 'var(--text-secondary,#374151)',
    },
    pastel: {
      backgroundColor: 'var(--bg-secondary,#F3F4F6)',
      borderColor: 'var(--border-default,var(--border-subtle,#D1D5DB))',
      color: 'var(--text-secondary,#374151)',
    },
  },
};

function isStatusColorKey(value: string): value is StatusColorKey {
  return value in statusColorClasses;
}

function getStatusColorKey(status: string | undefined) {
  if (!status) {
    return 'neutral';
  }

  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'pending') {
    return 'warning';
  }

  if (normalizedStatus === 'completed') {
    return 'info';
  }

  if (normalizedStatus === 'danger') {
    return 'error';
  }

  return isStatusColorKey(normalizedStatus) ? normalizedStatus : 'neutral';
}

export function getDefaultBadgeStatusStyle(
  status: string | undefined,
  variant: BadgeVariantName
) {
  return statusColorStyles[getStatusColorKey(status)][variant];
}

export const defaultBadgeStatusConfig = {
  success: {
    label: 'Success',
    colors: statusColorClasses.success,
  },
  pending: {
    label: 'Pending',
    colors: statusColorClasses.warning,
  },
  error: {
    label: 'Error',
    colors: statusColorClasses.error,
  },
  completed: {
    label: 'Completed',
    colors: statusColorClasses.info,
  },
  neutral: {
    label: 'Neutral',
    colors: statusColorClasses.neutral,
  },
} as const;

export const makeCustomColors = (
  colorName: string,
  status: string
): BadgeVariants => {
  const normalizedColor = colorName.toLowerCase();
  const statusKey = getStatusColorKey(status);
  const key = statusKey === 'neutral' ? normalizedColor : statusKey;

  return isStatusColorKey(key)
    ? statusColorClasses[key]
    : statusColorClasses.neutral;
};
