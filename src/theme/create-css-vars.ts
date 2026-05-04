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
  const vars: ComponentIqCssVariables = {};

  setVar(vars, '--color-primary', colors?.primary);
  setVar(vars, '--color-primary-fg', colors?.primaryForeground);
  setVar(vars, '--color-secondary', colors?.secondary);
  setVar(vars, '--color-secondary-fg', colors?.secondaryForeground);

  setVar(vars, '--bg-default', colors?.background);
  setVar(vars, '--bg-surface', colors?.surface);
  setVar(vars, '--bg-secondary', colors?.secondaryBackground);
  setVar(vars, '--bg-hover', colors?.hover);
  setVar(vars, '--bg-card-active', colors?.secondaryBackground);

  setVar(vars, '--text-title', colors?.title ?? colors?.foreground);
  setVar(vars, '--text-paragraph', colors?.foreground);
  setVar(vars, '--text-muted', colors?.muted);
  setVar(vars, '--text-brand', colors?.primary);
  setVar(vars, '--text-inverse', colors?.inverse ?? colors?.primaryForeground);

  setVar(vars, '--border-default', colors?.border);
  setVar(vars, '--border-subtle', colors?.borderSubtle);
  setVar(vars, '--border-focus', colors?.focus ?? colors?.primary);
  setVar(vars, '--status-error', colors?.destructive);
  setVar(vars, '--status-success', colors?.success);
  setVar(vars, '--status-warning', colors?.warning);
  setVar(vars, '--status-info', colors?.info);

  Object.entries(colors?.primaryScale ?? {}).forEach(([step, value]) => {
    setVar(vars, `--primary-${step}` as `--${string}`, value);
  });
  Object.entries(colors?.secondaryScale ?? {}).forEach(([step, value]) => {
    setVar(vars, `--secondary-${step}` as `--${string}`, value);
  });

  setVar(vars, '--background', colors?.background);
  setVar(vars, '--foreground', colors?.foreground);
  setVar(vars, '--card', colors?.surface);
  setVar(vars, '--card-foreground', colors?.foreground);
  setVar(vars, '--popover', colors?.surface);
  setVar(vars, '--popover-foreground', colors?.foreground);
  setVar(vars, '--primary', colors?.primary);
  setVar(vars, '--primary-foreground', colors?.primaryForeground);
  setVar(vars, '--secondary', colors?.secondary);
  setVar(vars, '--secondary-foreground', colors?.secondaryForeground);
  setVar(vars, '--muted', colors?.secondaryBackground);
  setVar(vars, '--muted-foreground', colors?.muted);
  setVar(vars, '--accent', colors?.hover);
  setVar(vars, '--accent-foreground', colors?.foreground);
  setVar(vars, '--destructive', colors?.destructive);
  setVar(vars, '--border', colors?.border);
  setVar(vars, '--input', colors?.border);
  setVar(vars, '--ring', colors?.focus ?? colors?.primary);
  setVar(vars, '--sidebar', colors?.secondaryBackground);
  setVar(vars, '--sidebar-foreground', colors?.foreground);
  setVar(vars, '--sidebar-primary', colors?.primary);
  setVar(vars, '--sidebar-primary-foreground', colors?.primaryForeground);
  setVar(vars, '--sidebar-accent', colors?.hover);
  setVar(vars, '--sidebar-accent-foreground', colors?.foreground);
  setVar(vars, '--sidebar-border', colors?.border);
  setVar(vars, '--sidebar-ring', colors?.focus ?? colors?.primary);

  setVar(vars, '--font-sans', typography?.fontFamily);
  setVar(vars, '--font-rubik', typography?.fontFamily);
  setVar(vars, '--font-heading', typography?.headingFontFamily);
  setVar(vars, '--font-mono', typography?.monoFontFamily);
  setVar(vars, '--font-size-base', typography?.baseSize);
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

  return vars;
}
