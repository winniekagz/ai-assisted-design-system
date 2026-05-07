import { BadgeVariants } from '../../../types/badgw';

export type BadgeVariantName = 'filled' | 'outlined' | 'pastel';

const statusColorClasses = {
  success: {
    filled:
      'bg-[color:var(--helper-success)] text-[color:var(--text-inverse)] border-[color:var(--helper-success)]',
    outlined:
      'bg-transparent text-[color:var(--helper-success)] border-[color:var(--helper-success)]',
    pastel:
      'bg-[color:var(--helper-success-pastel)] text-[color:var(--helper-success)] border-[color:var(--helper-success)]',
  },
  warning: {
    filled:
      'bg-[color:var(--helper-warning)] text-[color:var(--text-inverse)] border-[color:var(--helper-warning)]',
    outlined:
      'bg-transparent text-[color:var(--helper-warning)] border-[color:var(--helper-warning)]',
    pastel:
      'bg-[color:var(--helper-warning-pastel)] text-[color:var(--helper-warning)] border-[color:var(--helper-warning)]',
  },
  error: {
    filled:
      'bg-[color:var(--helper-error)] text-[color:var(--text-inverse)] border-[color:var(--helper-error)]',
    outlined:
      'bg-transparent text-[color:var(--helper-error)] border-[color:var(--helper-error)]',
    pastel:
      'bg-[color:var(--helper-error-pastel)] text-[color:var(--helper-error)] border-[color:var(--helper-error)]',
  },
  info: {
    filled:
      'bg-[color:var(--helper-information)] text-[color:var(--text-inverse)] border-[color:var(--helper-information)]',
    outlined:
      'bg-transparent text-[color:var(--helper-information)] border-[color:var(--helper-information)]',
    pastel:
      'bg-[color:var(--helper-information-pastel)] text-[color:var(--helper-information)] border-[color:var(--helper-information)]',
  },
  link: {
    filled:
      'bg-[color:var(--helper-link)] text-[color:var(--text-inverse)] border-[color:var(--helper-link)]',
    outlined:
      'bg-transparent text-[color:var(--helper-link)] border-[color:var(--helper-link)]',
    pastel:
      'bg-[color:var(--helper-link-pastel)] text-[color:var(--helper-link)] border-[color:var(--helper-link)]',
  },
  neutral: {
    filled:
      'bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border-[color:var(--border-default)]',
    outlined:
      'bg-transparent text-[color:var(--text-secondary)] border-[color:var(--border-default)]',
    pastel:
      'bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border-[color:var(--border-default)]',
  },
} satisfies Record<string, BadgeVariants>;

type StatusColorKey = keyof typeof statusColorClasses;

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
  return statusColorClasses[getStatusColorKey(status)][variant];
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
