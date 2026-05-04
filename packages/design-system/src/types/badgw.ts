import { type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { badgeVariants } from '../components/ui/badge/badgeVariants';

export interface BadgeVariants {
  filled: string;
  outlined: string;
  pastel: string;
}

export interface BadgeStatusDefinition {
  label: string;
  colors: BadgeVariants;
}

// Status types
export type BadgeStatus =
  | 'success'
  | 'pending'
  | 'error'
  | 'completed'
  | 'neutral';

// Color scheme variants
export interface BadgeVariantColors {
  bg: string;
  text: string;
  border?: string; // only used for outlined, but optional so we can reuse type
}

export interface BadgeColors {
  filled?: BadgeVariantColors;
  outlined?: BadgeVariantColors;
  pastel?: BadgeVariantColors;
}

export type FilledColors = { bg: string; text: string };
export type OutlinedColors = { bg: string; text: string; border: string };
export type PastelColors = { bg: string; text: string };

export interface BadgeStatusOptions {
  label?: string;
  colors?: BadgeColors;
}

// Config mapping for all statuses
export type BadgeStatusConfig = Partial<
  Record<BadgeStatus, BadgeStatusOptions>
> &
  Record<string, BadgeStatusOptions>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status?: BadgeStatus | string;
  statusConfig?: BadgeStatusConfig;
  colorStatus?: BadgeStatus | string; // Allow specifying a different status for colors
  icon?: LucideIcon;
  iconPosition?: 'start' | 'end';
  children?: React.ReactNode;
}
