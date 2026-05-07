import { cn } from '@/lib/utils';
import { BadgeStatus, BadgeStatusConfig } from '../../../types/badgw';
import {
  defaultBadgeStatusConfig,
  getDefaultBadgeStatusStyle,
  makeCustomColors,
} from './badgeColors';
import { badgeVariants } from './badgeVariants';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: BadgeStatus | string;
  variant?: 'filled' | 'outlined' | 'pastel';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ElementType;
  iconPosition?: 'start' | 'end';
  statusConfig?: BadgeStatusConfig;
  colorStatus?: BadgeStatus | string; // Allow specifying a different status for colors
  children?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'pastel',
  size = 'md',
  status,
  statusConfig,
  colorStatus, // New prop to specify color status
  icon: Icon,
  iconPosition = 'start',
  children,
  style,
  ...props
}: BadgeProps) {
  let colors = getDefaultBadgeStatusStyle(colorStatus || status, variant);
  let label = '';

  // Use colorStatus for colors if provided, otherwise use status
  const colorKey = colorStatus || status;

  // Handle custom status configuration
  if (
    statusConfig &&
    status &&
    statusConfig[status as keyof typeof statusConfig]
  ) {
    const customConfig = statusConfig[status as keyof typeof statusConfig];
    label = customConfig?.label || status;

    if (customConfig?.colors) {
      const variantColors =
        customConfig.colors[variant as keyof typeof customConfig.colors];
      if (variantColors) {
        colors =
          `${variantColors.bg} ${variantColors.text} ${variantColors.border || ''}`.trim();
      }
    }
  }
  // Handle default status configuration
  else if (
    colorKey &&
    defaultBadgeStatusConfig[colorKey as keyof typeof defaultBadgeStatusConfig]
  ) {
    const defaultConfig =
      defaultBadgeStatusConfig[
        colorKey as keyof typeof defaultBadgeStatusConfig
      ];
    label = status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : defaultConfig.label;
  }
  // Fallback for unknown statuses
  else if (status) {
    label = status.charAt(0).toUpperCase() + status.slice(1);
    // Generate colors based on status name
    const colorName = status.toLowerCase();
    const customColors = makeCustomColors(colorName, status);
    colors = customColors[variant as keyof typeof customColors] || '';
  }

  return (
    <div
      className={cn(badgeVariants({ variant, size }), colors, className)}
      style={style}
      {...props}
    >
      {Icon && iconPosition === 'start' && <Icon className='mr-2 h-4 w-4' />}
      {children || label}
      {Icon && iconPosition === 'end' && <Icon className='ml-2 h-4 w-4' />}
    </div>
  );
}
