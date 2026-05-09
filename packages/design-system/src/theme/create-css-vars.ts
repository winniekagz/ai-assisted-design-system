import type { CSSProperties } from 'react';
import { mergeComponentIqTokens } from './merge-tokens';
import type { ComponentIqTokens } from './tokens';

export type ComponentIqCssVariables = CSSProperties &
  Record<`--${string}`, string>;

function setVar(
  vars: ComponentIqCssVariables,
  name: `--${string}`,
  value: string | number | undefined
) {
  if (value !== undefined && value !== '') {
    vars[name] = String(value);
  }
}

export function createComponentIqCssVariables(
  tokens?: ComponentIqTokens
): ComponentIqCssVariables {
  const merged = mergeComponentIqTokens(tokens);
  const colors = merged.colors;
  const typography = merged.typography;
  const radius = merged.radius;
  const spacing = merged.spacing;
  const shadows = merged.shadows;
  const strokeWidth = merged.strokeWidth;
  const motion = merged.motion;
  const zIndex = merged.zIndex;
  const vars: ComponentIqCssVariables = {};
  const textPrimary =
    colors?.textPrimary ?? colors?.title ?? colors?.foreground;
  const textParagraph = colors?.foreground ?? textPrimary;
  const textSecondary = colors?.textSecondary ?? colors?.muted ?? textParagraph;
  const textMuted = colors?.textMuted ?? colors?.muted ?? textSecondary;
  const textDisabled =
    colors?.textDisabled ??
    (textPrimary
      ? `color-mix(in oklab, ${textPrimary} 35%, transparent)`
      : undefined);
  const error = colors?.error ?? colors?.destructive;
  const warning = colors?.warning;
  const success = colors?.success;
  const information = colors?.information ?? colors?.info;
  const link = colors?.link ?? information;

  setVar(vars, '--color-primary', colors?.primary);
  setVar(vars, '--color-primary-fg', colors?.primaryForeground);
  setVar(vars, '--color-primary-500', colors?.primary);
  setVar(vars, '--color-secondary', colors?.secondary);
  setVar(vars, '--color-secondary-fg', colors?.secondaryForeground);
  setVar(vars, '--color-secondary-500', colors?.secondary);

  setVar(vars, '--bg-default', colors?.background);
  setVar(vars, '--bg-surface', colors?.surface);
  setVar(vars, '--bg-secondary', colors?.secondaryBackground);
  setVar(vars, '--bg-hover', colors?.hover);
  setVar(vars, '--bg-card-active', colors?.secondaryBackground);
  setVar(vars, '--bg-paper', colors?.surface);

  setVar(vars, '--text-title', colors?.title ?? textPrimary);
  setVar(vars, '--text-primary', textPrimary);
  setVar(vars, '--text-paragraph', textParagraph);
  setVar(vars, '--text-secondary', textSecondary);
  setVar(vars, '--text-muted', textMuted);
  setVar(vars, '--text-disabled', textDisabled);
  setVar(vars, '--text-brand', colors?.primary);
  setVar(vars, '--text-inverse', colors?.inverse ?? colors?.primaryForeground);

  setVar(vars, '--border-default', colors?.border);
  setVar(vars, '--border-subtle', colors?.borderSubtle);
  setVar(vars, '--border-focus', colors?.focus ?? colors?.primary);
  setVar(vars, '--color-border-default', colors?.border);
  setVar(vars, '--helper-error', error);
  setVar(vars, '--helper-error-pastel', colors?.errorPastel);
  setVar(vars, '--helper-warning', warning);
  setVar(vars, '--helper-warning-pastel', colors?.warningPastel);
  setVar(vars, '--helper-success', success);
  setVar(vars, '--helper-success-pastel', colors?.successPastel);
  setVar(vars, '--helper-information', information);
  setVar(vars, '--helper-information-pastel', colors?.informationPastel);
  setVar(vars, '--helper-link', link);
  setVar(vars, '--helper-link-pastel', colors?.linkPastel);

  setVar(vars, '--status-error', error);
  setVar(vars, '--status-error-bg', colors?.errorPastel);
  setVar(vars, '--status-success', success);
  setVar(vars, '--status-success-bg', colors?.successPastel);
  setVar(vars, '--status-warning', warning);
  setVar(vars, '--status-warning-bg', colors?.warningPastel);
  setVar(vars, '--status-info', information);
  setVar(vars, '--status-info-bg', colors?.informationPastel);

  Object.entries(colors?.primaryScale ?? {}).forEach(([step, value]) => {
    setVar(vars, `--primary-${step}` as `--${string}`, value);
  });
  Object.entries(colors?.secondaryScale ?? {}).forEach(([step, value]) => {
    setVar(vars, `--secondary-${step}` as `--${string}`, value);
  });

  setVar(vars, '--background', colors?.background);
  setVar(vars, '--foreground', textParagraph);
  setVar(vars, '--card', colors?.surface);
  setVar(vars, '--card-foreground', colors?.foreground);
  setVar(vars, '--popover', colors?.surface);
  setVar(vars, '--popover-foreground', colors?.foreground);
  setVar(vars, '--primary', colors?.primary);
  setVar(vars, '--primary-foreground', colors?.primaryForeground);
  setVar(vars, '--secondary', colors?.secondary);
  setVar(vars, '--secondary-foreground', colors?.secondaryForeground);
  setVar(vars, '--muted', colors?.secondaryBackground);
  setVar(vars, '--muted-foreground', textMuted);
  setVar(vars, '--accent', colors?.hover);
  setVar(vars, '--accent-foreground', colors?.foreground);
  setVar(vars, '--destructive', error);
  setVar(vars, '--border', colors?.border);
  setVar(vars, '--input', colors?.border);
  setVar(vars, '--ring', colors?.focus ?? colors?.primary);
  setVar(vars, '--sidebar', colors?.secondaryBackground);
  setVar(vars, '--sidebar-foreground', textParagraph);
  setVar(vars, '--sidebar-primary', colors?.primary);
  setVar(vars, '--sidebar-primary-foreground', colors?.primaryForeground);
  setVar(vars, '--sidebar-accent', colors?.hover);
  setVar(vars, '--sidebar-accent-foreground', colors?.foreground);
  setVar(vars, '--sidebar-border', colors?.border);
  setVar(vars, '--sidebar-ring', colors?.focus ?? colors?.primary);
  setVar(vars, '--color-text-primary', textPrimary);
  setVar(vars, '--color-text-paragraph', textParagraph);
  setVar(vars, '--color-text-secondary', textSecondary);
  setVar(vars, '--color-text-muted', textMuted);
  setVar(vars, '--color-text-disabled', textDisabled);
  setVar(vars, '--color-helper-warning', warning);
  setVar(vars, '--color-helper-warning-pastel', colors?.warningPastel);
  setVar(vars, '--color-helper-link', link);
  setVar(vars, '--color-helper-link-pastel', colors?.linkPastel);
  setVar(vars, '--color-helper-information', information);
  setVar(vars, '--color-helper-information-pastel', colors?.informationPastel);
  setVar(vars, '--color-helper-error', error);
  setVar(vars, '--color-helper-error-pastel', colors?.errorPastel);
  setVar(vars, '--color-helper-success', success);
  setVar(vars, '--color-helper-success-pastel', colors?.successPastel);
  setVar(vars, '--color-error-500', error);
  setVar(vars, '--color-success-500', success);
  setVar(vars, '--color-warning-500', warning);
  setVar(vars, '--color-information-500', information);

  setVar(vars, '--font-sans', typography?.fontFamily);
  setVar(vars, '--font-rubik', typography?.fontFamily);
  setVar(vars, '--font-heading', typography?.headingFontFamily);
  setVar(vars, '--font-mono', typography?.monoFontFamily);
  setVar(vars, '--font-size-base', typography?.baseSize);
  setVar(vars, '--font-size-body', typography?.bodySize);
  setVar(vars, '--font-size-body-sm', typography?.bodySmallSize);
  setVar(vars, '--font-size-caption', typography?.captionSize);
  setVar(vars, '--font-size-heading-1', typography?.heading1Size);
  setVar(vars, '--font-size-heading-2', typography?.heading2Size);
  setVar(vars, '--font-size-heading-3', typography?.heading3Size);
  setVar(vars, '--font-size-heading-4', typography?.heading4Size);
  setVar(vars, '--font-size-heading-5', typography?.heading5Size);
  setVar(vars, '--font-size-heading-6', typography?.heading6Size);
  setVar(vars, '--font-size-display-1', typography?.display1Size);
  setVar(vars, '--font-size-display-2', typography?.display2Size);
  setVar(vars, '--font-size-display-3', typography?.display3Size);
  setVar(vars, '--font-weight-bold', typography?.headingWeight);
  setVar(vars, '--font-weight-regular', typography?.bodyWeight);

  setVar(vars, '--radius-xs', radius?.xs);
  setVar(vars, '--radius-sm', radius?.sm);
  setVar(vars, '--radius-md', radius?.md);
  setVar(vars, '--radius-lg', radius?.lg);
  setVar(vars, '--radius-xl', radius?.xl);
  setVar(vars, '--radius-full', radius?.full);
  setVar(vars, '--radius', radius?.md);

  setVar(vars, '--spacing-xs', spacing?.xs);
  setVar(vars, '--spacing-sm', spacing?.sm);
  setVar(vars, '--spacing-md', spacing?.md);
  setVar(vars, '--spacing-lg', spacing?.lg);
  setVar(vars, '--spacing-xl', spacing?.xl);
  setVar(vars, '--spacing-2xl', spacing?.['2xl']);

  setVar(vars, '--shadow-sm', shadows?.sm);
  setVar(vars, '--shadow-md', shadows?.md);
  setVar(vars, '--shadow-lg', shadows?.lg);

  setVar(vars, '--stroke-hairline', strokeWidth?.hairline);
  setVar(vars, '--stroke-thin', strokeWidth?.thin);
  setVar(vars, '--stroke-md', strokeWidth?.md);
  setVar(vars, '--stroke-lg', strokeWidth?.lg);
  setVar(vars, '--border-width-hairline', strokeWidth?.hairline);
  setVar(vars, '--border-width-thin', strokeWidth?.thin);
  setVar(vars, '--border-width-sm', strokeWidth?.thin);
  setVar(vars, '--border-width-md', strokeWidth?.md);
  setVar(vars, '--border-width-lg', strokeWidth?.lg);

  setVar(vars, '--motion-fast', motion?.fast);
  setVar(vars, '--motion-normal', motion?.normal);
  setVar(vars, '--motion-slow', motion?.slow);
  setVar(vars, '--motion-easing', motion?.easing);

  setVar(vars, '--z-base', zIndex?.base);
  setVar(vars, '--z-dropdown', zIndex?.dropdown);
  setVar(vars, '--z-sticky', zIndex?.sticky);
  setVar(vars, '--z-overlay', zIndex?.overlay);
  setVar(vars, '--z-modal', zIndex?.modal);
  setVar(vars, '--z-toast', zIndex?.toast);

  return vars;
}
