export type ComponentIqColorScale = Partial<{
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}>;

export interface ComponentIqColorTokens {
  primary?: string;
  primaryForeground?: string;
  primaryScale?: ComponentIqColorScale;
  secondary?: string;
  secondaryForeground?: string;
  secondaryScale?: ComponentIqColorScale;
  background?: string;
  surface?: string;
  secondaryBackground?: string;
  hover?: string;
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
  textDisabled?: string;
  foreground?: string;
  title?: string;
  muted?: string;
  inverse?: string;
  border?: string;
  borderSubtle?: string;
  focus?: string;
  error?: string;
  errorPastel?: string;
  warning?: string;
  warningPastel?: string;
  success?: string;
  successPastel?: string;
  information?: string;
  informationPastel?: string;
  link?: string;
  linkPastel?: string;
  destructive?: string;
  info?: string;
}

export interface ComponentIqTypographyTokens {
  fontFamily?: string;
  headingFontFamily?: string;
  monoFontFamily?: string;
  baseSize?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
}

export interface ComponentIqRadiusTokens {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  full?: string;
}

export interface ComponentIqSpacingTokens {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}

export interface ComponentIqShadowTokens {
  sm?: string;
  md?: string;
  lg?: string;
}

export interface ComponentIqTokens {
  colors?: ComponentIqColorTokens;
  typography?: ComponentIqTypographyTokens;
  radius?: ComponentIqRadiusTokens;
  spacing?: ComponentIqSpacingTokens;
  shadows?: ComponentIqShadowTokens;
}
