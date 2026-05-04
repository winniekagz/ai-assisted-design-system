import { defaultComponentIqTokens } from './default-tokens';
import type { ComponentIqTokens } from './tokens';

export const componentIqThemes = {
  default: defaultComponentIqTokens,
  ocean: {
    ...defaultComponentIqTokens,
    colors: {
      ...defaultComponentIqTokens.colors,
      primary: '#0F766E',
      primaryForeground: '#F8FAFC',
      secondary: '#2563EB',
      focus: '#0F766E',
    },
    typography: {
      ...defaultComponentIqTokens.typography,
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      headingFontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    },
  },
  editorial: {
    ...defaultComponentIqTokens,
    colors: {
      ...defaultComponentIqTokens.colors,
      primary: '#6D28D9',
      primaryForeground: '#FFFFFF',
      secondary: '#BE123C',
      focus: '#6D28D9',
    },
    typography: {
      ...defaultComponentIqTokens.typography,
      fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
      headingFontFamily: "'Fraunces', Georgia, serif",
    },
  },
} satisfies Record<string, ComponentIqTokens>;
