export type ContrastLevel = 'AA' | 'AAA';

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  // Base surfaces and text
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Action colors
  primary: string;
  primaryHover: string;
  primaryActive: string;

  secondary: string;
  secondaryHover: string;
  secondaryActive: string;

  accent: string;
  accentHover: string;
  accentActive: string;

  // Border tokens
  border: string;
  borderLight: string;
  borderHover: string;

  // Status
  success: string;
  successHover: string;
  warning: string;
  warningHover: string;
  error: string;
  errorHover: string;
  info: string;
  infoHover: string;
};

export type ThemeConfig = {
  id: string;
  name: string;
  category: string;
  description?: string;
  colors: ThemeColors;
  dark?: ThemeColors;
  metadata?: ThemeMetadata;
};

export type ThemeMetadata = {
  accessibility: 'AA' | 'AAA' | 'Fail';
  contrastRatio: number;
  mood: string[];
  tags: string[];
  version: string;
  created: string;
  updated: string;
};

export type CreateThemeInput = {
  id: string;
  name: string;
  category: string;
  primary: string;
  secondary?: string;
  accent?: string;
  description?: string;
  generateDark?: boolean;
  contrastLevel?: ContrastLevel;
  mode?: ThemeMode; // initial generation mode, defaults to light
};
