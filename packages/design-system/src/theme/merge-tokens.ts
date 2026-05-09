import { defaultComponentIqTokens } from './default-tokens';
import type { ComponentIqTokens } from './tokens';

function mergeTokenGroup<T extends object>(
  defaults: T | undefined,
  overrides: Partial<T> | undefined
): T | undefined {
  if (!defaults && !overrides) return undefined;

  return {
    ...(defaults ?? {}),
    ...(overrides ?? {}),
  } as T;
}

export function mergeComponentIqTokens(
  tokens?: ComponentIqTokens
): ComponentIqTokens {
  return {
    colors: {
      ...mergeTokenGroup(defaultComponentIqTokens.colors, tokens?.colors),
      primaryScale: mergeTokenGroup(
        defaultComponentIqTokens.colors?.primaryScale,
        tokens?.colors?.primaryScale
      ),
      secondaryScale: mergeTokenGroup(
        defaultComponentIqTokens.colors?.secondaryScale,
        tokens?.colors?.secondaryScale
      ),
    },
    typography: mergeTokenGroup(
      defaultComponentIqTokens.typography,
      tokens?.typography
    ),
    radius: mergeTokenGroup(defaultComponentIqTokens.radius, tokens?.radius),
    spacing: mergeTokenGroup(defaultComponentIqTokens.spacing, tokens?.spacing),
    shadows: mergeTokenGroup(defaultComponentIqTokens.shadows, tokens?.shadows),
    strokeWidth: mergeTokenGroup(
      defaultComponentIqTokens.strokeWidth,
      tokens?.strokeWidth
    ),
    motion: mergeTokenGroup(defaultComponentIqTokens.motion, tokens?.motion),
    zIndex: mergeTokenGroup(defaultComponentIqTokens.zIndex, tokens?.zIndex),
  };
}
