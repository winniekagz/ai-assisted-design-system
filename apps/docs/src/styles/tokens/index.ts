// Export all token modules
export * from './border';
export * from './breakpoints';
export * from './colors';
export * from './elevation';
export * from './motion';
export * from './opacity';
export * from './sizing';
export * from './spacing';
export * from './states';
export * from './typography';

// Import all tokens for the main export
import { border } from './border';
import { breakpoints, breakpointUtils } from './breakpoints';
import { darkColors, lightColors, type ColorMode } from './colors';
import { elevation } from './elevation';
import { motion } from './motion';
import { opacity } from './opacity';
import { sizing } from './sizing';
import { spacing } from './spacing';
import { states } from './states';
import { typography } from './typography';

// Main design tokens object
export const designTokens = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  spacing,
  sizing,
  border,
  elevation,
  opacity,
  motion,
  breakpoints,
  states,
  typography,
} as const;

// Type for the complete design tokens
export type DesignTokens = typeof designTokens;

// Utility function to generate CSS custom properties
export function generateCSSVariables(mode: ColorMode = 'light'): string {
  const colors = mode === 'light' ? lightColors : darkColors;

  const cssVariables = [
    // Color variables
    ...Object.entries(colors.primary).map(
      ([key, value]) => `--primary-${key}: ${value};`
    ),
    ...Object.entries(colors.secondary).map(
      ([key, value]) => `--secondary-${key}: ${value};`
    ),
    ...Object.entries(colors.error).map(
      ([key, value]) => `--error-${key}: ${value};`
    ),
    ...Object.entries(colors.warning).map(
      ([key, value]) => `--warning-${key}: ${value};`
    ),
    ...Object.entries(colors.info).map(
      ([key, value]) => `--info-${key}: ${value};`
    ),
    ...Object.entries(colors.success).map(
      ([key, value]) => `--success-${key}: ${value};`
    ),
    ...Object.entries(colors.neutral).map(
      ([key, value]) => `--neutral-${key}: ${value};`
    ),

    // Background variables
    `--background-default: ${colors.background.default};`,
    `--background-paper: ${colors.background.paper};`,
    `--background-secondary: ${colors.background.secondary};`,

    // Text variables
    `--text-primary: ${colors.text.primary};`,
    `--text-paragraph: ${colors.text.paragraph};`,
    `--text-secondary: ${colors.text.secondary};`,
    `--text-muted: ${colors.text.muted};`,
    `--text-disabled: ${colors.text.disabled};`,
    `--text-inverse: ${colors.text.inverse};`,

    // Helper / feedback variables
    `--helper-warning: ${colors.warning[500]};`,
    `--helper-warning-pastel: ${colors.warning[50]};`,
    `--helper-link: ${colors.info[500]};`,
    `--helper-link-pastel: ${colors.info[50]};`,
    `--helper-information: ${colors.info[500]};`,
    `--helper-information-pastel: ${colors.info[50]};`,
    `--helper-error: ${colors.error[500]};`,
    `--helper-error-pastel: ${colors.error[50]};`,
    `--helper-success: ${colors.success[500]};`,
    `--helper-success-pastel: ${colors.success[50]};`,

    // Border variables
    `--border-default: ${colors.border.default};`,
    `--border-secondary: ${colors.border.secondary};`,
    `--border-focus: ${colors.border.focus};`,
    `--border-error: ${colors.border.error};`,

    // Spacing variables
    ...Object.entries(spacing)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => `--spacing-${key}: ${value};`),

    // Sizing variables
    ...Object.entries(sizing)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => `--sizing-${key}: ${value};`),

    // Border radius variables
    ...Object.entries(border.radius)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => `--radius-${key}: ${value};`),

    // Border width variables
    ...Object.entries(border.width)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => `--border-width-${key}: ${value};`),

    // Shadow variables
    ...Object.entries(elevation.shadow).map(
      ([key, value]) => `--shadow-${key}: ${value};`
    ),

    // Opacity variables
    ...Object.entries(opacity.base).map(
      ([key, value]) => `--opacity-${key}: ${value};`
    ),

    // Motion variables
    ...Object.entries(motion.duration)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => `--duration-${key}: ${value};`),
  ];

  return `:root {\n  ${cssVariables.join('\n  ')}\n}`;
}

// Utility function to generate Tailwind CSS configuration
export function generateTailwindConfig() {
  return {
    theme: {
      extend: {
        colors: {
          primary: Object.fromEntries(
            Object.entries(lightColors.primary).map(([key, value]) => [
              key,
              value,
            ])
          ),
          secondary: Object.fromEntries(
            Object.entries(lightColors.secondary).map(([key, value]) => [
              key,
              value,
            ])
          ),
          error: Object.fromEntries(
            Object.entries(lightColors.error).map(([key, value]) => [
              key,
              value,
            ])
          ),
          warning: Object.fromEntries(
            Object.entries(lightColors.warning).map(([key, value]) => [
              key,
              value,
            ])
          ),
          info: Object.fromEntries(
            Object.entries(lightColors.info).map(([key, value]) => [key, value])
          ),
          success: Object.fromEntries(
            Object.entries(lightColors.success).map(([key, value]) => [
              key,
              value,
            ])
          ),
          neutral: Object.fromEntries(
            Object.entries(lightColors.neutral).map(([key, value]) => [
              key,
              value,
            ])
          ),
        },
        spacing: Object.fromEntries(
          Object.entries(spacing)
            .filter(([, value]) => typeof value === 'string')
            .map(([key, value]) => [key, value])
        ),
        borderRadius: Object.fromEntries(
          Object.entries(border.radius)
            .filter(([, value]) => typeof value === 'string')
            .map(([key, value]) => [key, value])
        ),
        boxShadow: Object.fromEntries(
          Object.entries(elevation.shadow).map(([key, value]) => [key, value])
        ),
        animation: Object.fromEntries(
          Object.entries(motion.animation).map(([key, value]) => [key, value])
        ),
        keyframes: motion.keyframes,
        transitionDuration: Object.fromEntries(
          Object.entries(motion.duration)
            .filter(([, value]) => typeof value === 'string')
            .map(([key, value]) => [key, value])
        ),
        transitionTimingFunction: Object.fromEntries(
          Object.entries(motion.easing)
            .filter(([, value]) => typeof value === 'string')
            .map(([key, value]) => [key, value])
        ),
      },
    },
  };
}

// Utility function to get token value by path
export function getTokenValue(tokens: DesignTokens, path: string): unknown {
  return path
    .split('.')
    .reduce(
      (obj: Record<string, unknown>, key) =>
        obj?.[key] as Record<string, unknown>,
      tokens as Record<string, unknown>
    );
}

// Utility function to create a theme provider
export function createThemeProvider(tokens: DesignTokens) {
  return {
    getCSSVariables: (mode: ColorMode = 'light') => generateCSSVariables(mode),
    getToken: (path: string) => getTokenValue(tokens, path),
    tokens,
  };
}

// Export utility functions
export { breakpointUtils };
