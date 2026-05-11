import type { ComponentIqTokens } from './tokens';

/**
 * Passes client tokens through without merging any library defaults.
 * All token values must be provided by the client — the library has no opinions.
 * Use `defaultComponentIqTokens` or `componentIqThemes` as a starting point if needed.
 */
export function mergeComponentIqTokens(
  tokens: ComponentIqTokens
): ComponentIqTokens {
  return tokens;
}
